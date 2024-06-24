import { curly } from 'node-libcurl';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createClient } from 'redis';
import { JSDOM } from 'jsdom';
import cron from 'node-cron';
import sources from './data/sources.json';

interface SourceXML {
  url: string,
  selectors: { [key: string]: string },
  pathnamePrefixes: string[]
};

interface Source {
  name: string,
  url: string,
  xmls: SourceXML[],
  timeOffset?: number,
  method?: string
};

const stripCtrlChars = (str: string) => str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

const fixXML = (xml: string) => stripCtrlChars(xml).replace(/&(?!#?[a-z0-9]+;)/g, '&amp;');

const fixJsonLd = (jsonLd: string) => stripCtrlChars(jsonLd);

const fixHTML = (html: string) => html.replace(/<style[^>]*?>[\s\S]*?<\/style[^>]*?>/gim, '');

const getExpiry = () => Date.now() / 1000 - 1296000; // 86400 * 15

puppeteer.use(StealthPlugin());

const fetchContent = async (url: string, method: string | undefined) => {
  console.log('fetchContent', url, new Date(), method !== undefined ? method : '');

  if (method === 'curl') {
    const data = (await curly.get(url, { timeout: 10 })).data;
    return typeof data === 'string' ? data : data.toString();
  }

  if (method === 'browser') {
    let browser;

    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const content = await page.content();
      await page.close();
      await browser.close();
      return content;
    } catch (e) {
      await browser?.close();
      throw e;
    }
  }

  return await fetch(url, { signal: AbortSignal.timeout(10000) }).then(response => response.text());
};

(async () => {
  const redis = await createClient({
    url: 'redis://redis'
  }).connect();

  const gatherUrls = async () => {
    const expiry = getExpiry();

    for (const [key, source] of Object.entries(sources as { [key: string]: Source})) {
      redis.HSET('realtime:sources', key, JSON.stringify({ name: source.name, url: source.url }));

      const method = source.method;

      for (const xml of source.xmls) {
        try {
          const content = fixXML(await fetchContent(xml.url, method));
          const dom = new JSDOM(content, { contentType: 'text/xml' });
          const selectors = xml.selectors;

          dom.window.document.querySelectorAll(selectors.root).forEach(async node => {
            const textContent = node.querySelector(selectors.url)?.textContent ?? null;

            if (textContent === null) {
              console.warn('textContent === null', key, xml);
              return;
            }

            try {
              const url = new URL(textContent);
              const pathname = url.pathname;

              if (xml.pathnamePrefixes.some(item => pathname.startsWith(item)) === false) {
                /* console.warn('pathname mismatch', key, xml, url); */
                return;
              }

              if (await redis.EXISTS(`realtime:article:${textContent}`) > 0 /*||
                  /* await redis.HEXISTS('realtime:candidates', textContent) === true || */) {
                return;
              }

              const date = node.querySelector(selectors.date)?.textContent;

              if (typeof date !== 'string') {
                console.warn("typeof date !== 'string'", key, xml, url);
                return;
              }

              const timestamp = Date.parse(date) / 1000;

              if (isNaN(timestamp) === true) {
                console.warn('isNaN(timestamp) === true', key, xml, url, date);
                return;
              }

              if (expiry > timestamp) {
                /* console.warn('expiry > timestamp', key, xml, url, date); */
                return;
              }

              const map: { source: string, timestamp: number } = {
                source: key,
                timestamp
              };

              redis.HSET('realtime:candidates', textContent, JSON.stringify(map));
             } catch (e) {
              console.warn(e, key, xml, textContent);
            }
          });
        } catch (e) {
          console.warn(e, key, xml);
        }
      };
    }
  };

  const crawlCandidates = async () => {
    const candidates = await redis.HGETALL('realtime:candidates');
    const expiry = getExpiry();

    for (const [url, json] of Object.entries(candidates)) {
      const map = JSON.parse(json);
      const key: keyof typeof sources = map.source;
      const source: Source = sources[key];

      try {
        const content = fixHTML(await fetchContent(url, source.method));
        const dom = new JSDOM(content);
        const document = dom.window.document;

        const jsonLd = (() => {
          for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
            try {
              const result = JSON.parse(fixJsonLd(script.textContent as string));

              for (const item of Array.isArray(result) === true ? result : [result]) {
                if (item['@type'] === 'NewsArticle') {
                  return item;
                }
              }
            } catch (e) {
              console.warn(e, url, map);
            }
          }

          return {};
        })();

        const date =
          jsonLd.datePublished ??
          document.querySelector('meta[itemprop="datePublished"], meta[property="article:published_time"], meta[name="pubdate"], meta[name="date"]')?.getAttribute('content') ??
          undefined;

        let timestamp;

        if (date === undefined) {
          timestamp = map.timestamp;
        } else {
          timestamp = Date.parse(date) / 1000;

          if (isNaN(timestamp) === true) {
            console.warn('isNaN(timestamp) === true', url, map, date);
            continue;
          }
        }

        const timeOffset = source.timeOffset;

        if (timeOffset !== undefined) {
          timestamp += timeOffset;
        }

        if (expiry > timestamp) {
          /* console.warn('expiry > timestamp', url, map, date); */
          redis.HDEL('realtime:candidates', url);
          continue;
        }

        if (timestamp > Date.now() / 1000) {
          console.warn('timestamp > Date.now() / 1000', url, map, date);
          redis.HDEL('realtime:candidates', url);
          continue;
        }

        const title =
          jsonLd.headline ??
          document.querySelector('meta[property="og:title"]')?.getAttribute('content') ??
          undefined;

        if (title === undefined) {
          console.warn('title === undefined', url, map);
          continue;
        }

        const image =
          document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
          jsonLd.thumbnailUrl ||
          jsonLd.image?.url ||
          undefined;

        const description =
          document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
          jsonLd.description ||
          undefined;

        redis.SET(`realtime:article:${url}`, JSON.stringify({
          timestamp,
          title,
          source: key,
          image,
          description
        }));

        redis.ZADD('realtime:pages', {
          score: timestamp,
          value: url
        });

        redis.HDEL('realtime:candidates', url);
      } catch (e) {
        console.warn(e, url, map);
      }
    };
  };

  cron.schedule('9,19,29,39,49,59 * * * *', (() => {
    let crawling = false;

    return async () => {
      if (crawling === true) {
        return;
      }

      crawling = true;
      await gatherUrls();
      await crawlCandidates();
      crawling = false;
    };
  })());

  const expireArticles = async () => {
    const expiry = getExpiry();
    const urls = await redis.ZRANGE('realtime:pages', '-inf', expiry, { BY: 'SCORE' });

    for (const url of urls) {
      redis.ZREM('realtime:pages', url);
      redis.DEL(`realtime:article:${url}`);
    }
  };

  cron.schedule('30 5,13,21 * * *', expireArticles);
})();
