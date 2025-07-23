import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '現在時間'
};

export default function Page() {
  return <Client/>;
};
