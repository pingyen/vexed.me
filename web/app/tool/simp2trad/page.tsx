import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '一次轉換多個簡體中文純文字檔至繁體中文'
};

export default function Page() {
  return <Client/>;
};
