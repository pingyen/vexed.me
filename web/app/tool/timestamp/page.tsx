import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: 'Unix Timestamp 與時間日期轉換'
};

export default function Page() {
  return <Client/>;
};
