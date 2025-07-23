import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '下載 Chrome Extension'
};

export default function Page() {
  return <Client/>;
};
