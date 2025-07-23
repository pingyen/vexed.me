import { readFileSync } from 'fs';
import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '全家 Fami!ce 霜淇淋列表'
};

export default function Page() {
  return <Client data={JSON.parse(readFileSync('./app/famiice/data.json', 'utf8'))} />;
};

export const revalidate = 600;
