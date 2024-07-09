import { readFile } from 'fs/promises';
import { createClient } from 'redis';
import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Ad from '../../../component/ad';
import Time from './time';
import Img from './img';
import Client from './client';

export const metadata: Metadata = {
  title: '台灣即時新聞'
};

const size = 100;

const adIds = new Map<number, number>([
  [10, 6212292798],
  [20, 7949280793],
  [30, 3519081194],
  [40, 9426013990],
  [50, 1902747194],
  [60, 3379480393],
  [70, 4856213595],
  [80, 6332946798],
  [90, 7809679994]
]);

const adClasses = 'max-w-[1200px] mx-auto';

export default async function Page({ params }: { params: { page?: string } }) {
  const [redis, ignoreImages, titleEndings] = await Promise.all([
    createClient({
      url: 'redis://redis'
    }).connect(),
    new Promise<Set<string>>(async resolve => {
      resolve(new Set(JSON.parse(await readFile('./app/realtime/[page]/ignoreImages.json', 'utf8'))));
    }),
    new Promise<Map<string, string>>(async resolve => {
      resolve(new Map(Object.entries(JSON.parse(await readFile('./app/realtime/[page]/titleEndings.json', 'utf8')))));
    })
  ]);

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

  const cleanTitle = (source: string, title: string) => {
    const ending = titleEndings.get(source);

    if (ending === undefined) {
      return title;
    }

    if (title.endsWith(ending) === true) {
      return title.substring(0, title.length - ending.length);
    }

    return title;
  };

  for (const url of urls) {
    const article = JSON.parse(await redis.GET(`realtime:article:${url}`) as string);
    const image = article.image;
    const source = article.source;

    ignoreImages.has(image) === true &&
      delete article.image;

    article.title = cleanTitle(source, article.title);
    article.source = sources.get(source);

    article.url = url;
    articles.push(article);
  }

  redis.disconnect();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="m-3 [&>*]:inline-block">
        <h1 className="mb-1 text-3xl font-bold"><Link href="/realtime" className="">台灣即時新聞</Link></h1>
        <p className="mx-3 align-center">{`這是第 ${page} 頁，共 ${num} 頁`}</p>
      </header>
      <main>
        {articles.map(({ url, timestamp, title, source, image, description }, index) => {
          const adId = adIds.get(index);
          return <Fragment key={index}>
            {adId !== undefined &&
              <Ad id={adId} classes={adClasses} />}
            <article className="bg-white m-3 p-4 border rounded shadow">
              <p>
                <a href={source.url} target="_blank">{source.name}</a>
                <Time timestamp={timestamp} />
              </p>
              <h2 className="text-xl font-bold mt-1 mb-2"><a className="text-[#1a0dab] scroll-mt-14" href={url} target="_blank">{title}</a></h2>
              {image !== undefined &&
                <Img src={image} alt={title} />}
              {description !== undefined &&
                <p>{description}</p>}
            </article>
          </Fragment>
        })}
        <Ad id={8820361999} classes={adClasses} />
      </main>
      <footer className="m-3">
        <ol className="text-xl [&>li]:inline-block [&>li>a]:block [&>li>a]:p-1.5">
          {page !== 1 && <>
            <li><Link href="/realtime">第一頁</Link></li>
            <li><Link href={`/realtime/${page - 1}`}>上一頁</Link></li></>}
          {pages.map((num, index) =>
            <li key={index} className={page === num ? '[&>a]:lg:text-red-600' : '!hidden lg:!inline-block'}><Link href={`/realtime/${num}`}>{num}</Link></li>)}
          {page !== num && <>
            <li><Link href={`/realtime/${page + 1}`} prefetch={true}>下一頁</Link></li>
            <li><Link href={`/realtime/${num}`}>最後頁</Link></li></>}
        </ol>
      </footer>
      <Client page={page} lastUrl={urls.at(-1) as string} />
    </div>
  );
};

export const revalidate = 180;
