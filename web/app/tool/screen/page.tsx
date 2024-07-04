import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '螢幕尺寸寬高面積對角線長換算'
};

export default function Page() {
  return <Client/>;
};
