import { RedisClientType } from 'redis';
import sources from './sources.json';
import fetchContent from '../lib/fetchContent';
import { JSDOM } from 'jsdom';

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

const cleanString = (str: string) => str.replace(/[ …\.]/g, '').replace(/　/g, ' ').toLowerCase();

const stripCtrlChars = (str: string) => str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

const fixXML = (xml: string) => stripCtrlChars(xml).replace(/&(?!#?[a-z0-9]+;)/g, '&amp;');

const fixJsonLd = (jsonLd: string) => stripCtrlChars(jsonLd);

const fixHTML = (html: string) => html.replace(/<style[^>]*?>[\s\S]*?<\/style[^>]*?>/gim, '');

const getExpiry = () => Date.now() / 1000 - 1296000; // 86400 * 15

let redis: RedisClientType;

const init = (client: RedisClientType) => {
  redis = client;
};

const gatherUrls = async () => {
  console.log('realtime gatherUrls() start');

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
            console.warn('realtime textContent === null', key, xml);
            return;
          }

          try {
            const url = new URL(textContent);
            const pathname = url.pathname;

            if (pathname === '/' || xml.pathnamePrefixes.some(item => pathname.startsWith(item)) === false) {
              /* console.warn('realtime pathname mismatch', key, xml, url); */
              return;
            }

            if (await redis.EXISTS(`realtime:article:${textContent}`) > 0 /*||
                /* await redis.HEXISTS('realtime:candidates', textContent) === true || */) {
              return;
            }

            const date = node.querySelector(selectors.date)?.textContent;

            if (typeof date !== 'string') {
              console.warn("realtime typeof date !== 'string'", key, xml, url);
              return;
            }

            const timestamp = Date.parse(date) / 1000;

            if (isNaN(timestamp) === true) {
              console.warn('realtime isNaN(timestamp) === true', key, xml, url, date);
              return;
            }

            if (expiry > timestamp) {
              /* console.warn('realtime expiry > timestamp', key, xml, url, date); */
              return;
            }

            const map: { source: string, timestamp: number } = {
              source: key,
              timestamp
            };

            redis.HSET('realtime:candidates', textContent, JSON.stringify(map));
          } catch (e) {
            console.warn('realtime', e, key, xml, textContent);
          }
        });
      } catch (e) {
        console.warn('realtime', e, key, xml);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('realtime gatherUrls() end');
};

const crawlCandidates = async () => {
  console.log('realtime crawlCandidates() start');

  const candidates = await redis.HGETALL('realtime:candidates');
  const expiry = getExpiry();
  const articles = new Map();

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
            console.warn('realtime', e, url, map);
          }
        }

        return {};
      })();

      const date =
        jsonLd.datePublished ??
        document.querySelector('meta[itemprop="datePublished"], meta[property="article:published_time"], meta[name="pubdate"], meta[name="date"]')?.getAttribute('content') ??
        undefined;

      const now = Date.now() / 1000;

      const timestamp = (() => {
        if (date === undefined) {
          return map.timestamp;
        }

        let timestamp = Date.parse(date);

        if (isNaN(timestamp) === true) {
          return map.timestamp;
        }

        timestamp /= 1000;

        const timeOffset = source.timeOffset;

        if (timeOffset !== undefined) {
          timestamp += timeOffset;
        }

        if (timestamp > now ||
            timestamp < expiry) {
          return map.timestamp;
        }

        return timestamp;
      })();

      if (timestamp > now) {
        console.warn('realtime timestamp > now', url, map, date);
        redis.HDEL('realtime:candidates', url);
        continue;
      }

      const title =
        jsonLd.headline ??
        document.querySelector('meta[property="og:title"]')?.getAttribute('content') ??
        undefined;

      if (title === undefined) {
        console.warn('realtime title === undefined', url, map);
        redis.HDEL('realtime:candidates', url);
        continue;
      }

      if (title === '') {
        console.warn("realtime title === ''", url, map);
        redis.HDEL('realtime:candidates', url);
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

      const cleanTitle = cleanString(title);
      const cleanDescription = typeof description === 'string' ? cleanString(description) : description;

      const article = {
        timestamp,
        title,
        source: key,
        image,
        description,
        cleanTitle,
        cleanDescription
      };

      articles.set(url, article);
      redis.SET(`realtime:article:${url}`, JSON.stringify(article));

      const urls = await redis.ZRANGE('realtime:pages', timestamp - 180, timestamp + 180, { BY: 'SCORE' });

      let slot = 'pages';

      for (const base of urls) {
        let article = articles.get(base);

        if (article === undefined) {
          article = JSON.parse(await redis.GET(`realtime:article:${base}`) as string);
          article.cleanTitle = cleanString(article.title);
          const description = article.description;
          article.cleanDescription = typeof description === 'string' ? cleanString(description) : undefined;
          articles.set(base, article);
        }

        if (article.cleanTitle === cleanTitle) {
          const cleanDescription2 = article.cleanDescription;

          if (cleanDescription === cleanDescription2 ||
              cleanDescription.startsWith(cleanDescription2) === true ||
              cleanDescription2.startsWith(cleanDescription) === true) {
            console.warn('realtime dup', url, base, article, timestamp, key, image);
            slot = 'dups';
            break;
          }
        }
      }

      redis.ZADD(`realtime:${slot}`, {
        score: timestamp,
        value: url
      });

      redis.HDEL('realtime:candidates', url);
    } catch (e) {
      console.warn('realtime', e, url, map);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  console.log('realtime crawlCandidates() end');
};

const expireArticles = async () => {
  console.log('realtime expireArticles() start');

  const expiry = getExpiry();

  const promises = [];

  for (const slot of ['pages', 'dups']) {
    const key = `realtime:${slot}`;
    const urls = await redis.ZRANGE(key, '-inf', expiry, { BY: 'SCORE' });

    for (const url of urls) {
      promises.push(redis.ZREM(key, url));
      promises.push(redis.DEL(`realtime:article:${url}`));
    }
  }

  await Promise.all(promises);

  console.log('realtime expireArticles() end');
};

export default {
  init,
  gatherUrls,
  crawlCandidates,
  expireArticles
};
