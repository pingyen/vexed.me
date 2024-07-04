import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '食'
};

export default function Page() {
  return <Client/>;
};
