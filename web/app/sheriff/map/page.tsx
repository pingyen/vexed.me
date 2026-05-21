import { readFileSync } from 'fs';
import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '7-11 所長茶葉蛋地圖'
};

export default function Page() {
  return <Client data={JSON.parse(readFileSync('./app/sheriff/data.json', 'utf8'))} />;
};

export const revalidate = 600;
