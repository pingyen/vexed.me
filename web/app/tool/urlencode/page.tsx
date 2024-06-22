import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '網址編碼解碼'
};

export default function Page() {
  return <Client/>;
};
