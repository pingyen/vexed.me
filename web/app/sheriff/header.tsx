'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Client(
  { button } :
  { button: { click: React.MouseEventHandler<HTMLButtonElement>, text: string } | undefined }) {
  const current = 'font-bold text-red-600 border-b-4 border-red-600';
  const pathname = usePathname();

  return (
    <header className="mx-3 mb-3 *:inline-block">
      <h1 className="text-4xl font-bold relative top-2 mb-1">7-11 所長茶葉蛋</h1>
      <nav className="ml-2 mt-2">
        <ul className="[&>li]:inline-block [&>li>a]:p-1">
          <li><Link href="/sheriff" className={pathname === '/sheriff' ? current : undefined} >列表</Link></li>
          <li><Link href="/sheriff/map" className={pathname === '/sheriff/map' ? current : undefined}>地圖</Link></li>
        </ul>
      </nav>
      {button !== undefined &&
        <button className='text-sm ml-2 pt-4 pb-3 active:scale-95' onClick={button.click}>{button.text}</button>}
    </header>
  );
}
