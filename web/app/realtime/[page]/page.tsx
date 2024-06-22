import { createClient } from 'redis';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Time from './time';
import Img from './img';
import Client from './client';

export const metadata: Metadata = {
  title: '台灣即時新聞'
};

const size = 100;

const ignoreImages = new Set([
  'https://udn.com/static/img/UDN_BABY.png',
  'https://money.udn.com/static/img/moneyudn.jpg',
  'https://uc.udn.com.tw/upf/2015_money/SSI/ednvip/default_logo/logo_1280.png',
  'https://static.chinatimes.com/images/2020/logo-chinatimes-250x250.png',
  'https://www.cna.com.tw/img/pic_fb.jpg'
]);

const cleanTitle = (source: string, title: string) => {
  switch (source) {
    case 'upmedia':
      return title.endsWith('--上報') === true ?
        title.substring(0, title.length - 4) :
        title;
    case 'tvbs':
      return title.endsWith('│TVBS新聞網') === true ?
        title.substring(0, title.length - 8) :
        title;
    default:
      return title;
  }
};

export default async function Page({ params }: { params: { page?: string } }) {
  const redis = await createClient({
    url: 'redis://redis'
  }).connect();

  const [sources, num] = await Promise.all([
    new Promise<Map<string, { url: string, name: string }>>(async (resolve) => {
      const map = new Map();

      for (const [key, json] of Object.entries(await redis.HGETALL('realtime:sources'))) {
        map.set(key, JSON.parse(json));
      }

      resolve(map);
    }),
    new Promise<number>(async resolve => {
      resolve(Math.ceil(await redis.ZCARD('realtime:pages') / size));
    })
  ]);

  const page = ((param: string | undefined) => {
    if (param === undefined) {
      return 1;
    }

    const page = parseInt(param);

    if (isNaN(page) === true ||
        page < 1 ||
        page > num) {
      notFound();
    }

    return page;
  })(params.page);

  const pages = (() => {
    const pages = [];

    let base = page;

    const temp = num - 5;

    if(base > temp) {
      base = temp;
    }

    if(base < 5) {
      base = 5;
    }

    const start = base - 4;

    let end = base + 5;

    if(end > num) {
      end = num;
    }

    for (let i = start; i <= end; ++i) {
      pages.push(i);
    }

    return pages;
  })();

  const start = (page - 1) * size;
  const stop = page * size - 1;
  const urls = await redis.ZRANGE('realtime:pages', start, stop, { REV: true });
  const articles = [];

  for (const url of urls) {
    const article = JSON.parse(await redis.GET(`realtime:article:${url}`) as string);
    const image = article.image;
    const source = article.source;

    ignoreImages.has(image) === true &&
      delete article.image;

    article.title = cleanTitle(source, article.title);
    article.source = sources.get(article.source);

    article.url = url;
    articles.push(article);
  }

  return <>
    <header className="m-3 [&>*]:inline-block">
      <h1 className="mb-1 text-3xl font-bold"><Link href="/realtime" className="">台灣即時新聞</Link></h1>
      <p className="mx-3 align-center">{`這是第 ${page} 頁，共 ${num} 頁`}</p>
    </header>
    <main>
      {articles.map(({ url, timestamp, title, source, image, description }, index) =>
        <article key={index} className="bg-white m-3 p-4 border rounded shadow">
          <p>
            <a href={source.url} target="_blank">{source.name}</a>
            <Time timestamp={timestamp} />
          </p>
          <h2 className="text-xl font-bold mt-1 mb-2"><a className="text-[#1a0dab]" href={url} target="_blank">{title}</a></h2>
          {image !== undefined &&
            <Img src={image} alt={title} />}
          {description !== undefined &&
            <p>{description}</p>}
        </article>)}
    </main>
    <footer className="m-3">
      <ol className="[&>li]:inline-block [&>li]:mr-3">
        {page !== 1 && <>
          <li><Link href="/realtime">第一頁</Link></li>
          <li><Link href={`/realtime/${page - 1}`}>上一頁</Link></li></>}
        {pages.map((num, index) =>
          <li key={index}><Link href={`/realtime/${num}`} className={page === num ? 'text-red-600' : undefined}>{num}</Link></li>)}
        {page !== num && <>
          <li><Link href={`/realtime/${page + 1}`}>下一頁</Link></li></>}
          <li><Link href={`/realtime/${num}`}>最後頁</Link></li>
      </ol>
    </footer>
    <Client page={page} lastUrl={urls.at(-1) as string} />
  </>;
};

export const revalidate = 600;
