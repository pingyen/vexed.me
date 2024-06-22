import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '日期距離計算機'
};

export default function Page() {
  return <Client/>;
};
