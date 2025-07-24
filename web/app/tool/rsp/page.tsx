import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '定期定額計算機'
};

export default function Page() {
  return <Client/>;
};
