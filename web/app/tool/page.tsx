import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Vexed's Online Tools"
};

export default function Page() {
  return (
    <main>
      <h1 className="m-3 text-4xl font-bold">Vexed&apos;s Online Tools</h1>
      <ul className="ml-6 [&>li]:m-3 [&>li]:list-disc">
        <li><Link href="/tool/resizeimage">一次調整多張圖片寬高</Link></li>
        <li><Link href="/tool/svg2image">一次轉換多張 SVG 為 JPG 、 PNG 或 WebP</Link></li>
        <li><Link href="/tool/simp2trad">一次轉換多個簡體中文純文字檔至繁體中文</Link></li>
        <li><Link href="/tool/zhuyin">注音忘記切換輸入法亂碼翻譯器</Link></li>
        <li><Link href="/tool/whatday">這天星期幾？</Link></li>
        <li><Link href="/tool/days">日期距離計算機</Link></li>
        <li><Link href="/tool/timestamp">Unix Timestamp 與時間日期轉換</Link></li>
        <li><Link href="/tool/now">現在時間</Link></li>
        <li><Link href="/tool/urlencode">網址編碼解碼</Link></li>
        <li><Link href="/tool/screen">螢幕尺寸寬高面積對角線長換算</Link></li>
        <li><Link href="/tool/crxdl">下載 Chrome Extension</Link></li>
      </ul>
    </main>
  );
}
