import type { Metadata } from 'next';
import Image from 'next/image';
import Client from './client';

export const metadata: Metadata = {
  title: 'Vexed.Me'
};

export default function Page() {
  return <>
    <main className="bg-[#FFD356] min-h-screen font-serif
      [&>*]:inline-block
      [&>ul]:mx-12
      [&>ul>li]:list-disc [&>ul>li]:py-2
      [&>ul>li>a]:block [&>ul>li>a]:tracking-widest
      [&>ul>li>a:first-letter]:text-5xl [&>ul>li>a:first-letter]:font-bold
      [&>ul>li>a:hover]:text-red-700">
      <p>
        <Image src="/Vexed.png" width="480" height="480" alt="Vexed" priority className="w-full max-w-[480px]"/>
      </p>
      <ul>
          <li><a href="/realtime" target="_blank">Taiwan Realtime News</a></li>
          <li><a href="/food" target="_blank">Food</a></li>
          <li><a href="/tool" target="_blank">Tools</a></li>
      </ul>
      <ul>
          <li><a href="https://github.com/pingyen" target="_blank" >GitHub</a></li>
          <li><a href="https://gist.github.com/pingyen" target="_blank" >GitHub Gist</a></li>
          <li><a href="https://www.linkedin.com/in/pingyen" target="_blank" >LinkedIn</a></li>
          <li><a href="https://speakerdeck.com/pingyen" target="_blank" >Speaker Deck</a></li>
      </ul>
      <ul>
          <li><a href="https://www.facebook.com/pingyen.tsai" target="_blank" >Facebook</a></li>
          <li><a href="https://www.instagram.com/vexed/" target="_blank" >Instagram</a></li>
          <li><a href="https://t.me/pingyentsai" target="_blank" >Telegram</a></li>
          <li><a href="https://t.me/P_Vexed" target="_blank" >Telegram Group</a></li>
      </ul>
    </main>
    <Client/>
  </>;
}
