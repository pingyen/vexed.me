import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '這天星期幾？'
};

export default function Page() {
  return <Client/>;
};
