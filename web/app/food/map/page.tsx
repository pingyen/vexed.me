import { readFileSync } from 'fs';
import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '食 - 地圖'
};

export default function Page() {
  return <Client data={JSON.parse(readFileSync('./app/food/data.json', 'utf8'))} />;
};

export const revalidate = 600;
