import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '一次轉換多張 SVG 為 JPG 、 PNG 或 WebP'
};

export default function Page() {
  return <Client/>;
};
