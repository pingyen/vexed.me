import type { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: '注音忘記切換輸入法亂碼翻譯器'
};

export default function Page() {
  return <Client/>;
};
