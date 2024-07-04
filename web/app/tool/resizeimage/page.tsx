import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '一次調整多張圖片寬高'
};

export default function Page() {
  return <Client/>;
};
