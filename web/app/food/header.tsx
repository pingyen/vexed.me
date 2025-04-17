'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Client(
  { button } :
  { button : { click: React.MouseEventHandler<HTMLButtonElement>, text: string } | undefined }) {
  const current = 'font-bold text-red-600 border-b-4 border-red-600';
  const pathname = usePathname();

  return (
    <header className="mx-3 mb-3 *:inline-block">
      <h1 className="text-4xl font-bold relative top-2">食</h1>
      <nav className="mx-2">
        <ul className="[&>li]:inline-block [&>li>a]:p-1">
          <li><Link href="/food" className={pathname === '/food' ? current : undefined} >列表</Link></li>
          <li><Link href="/food/map" className={pathname === '/food/map' ? current : undefined}>地圖</Link></li>
        </ul>
      </nav>
      {button !== undefined &&
        <button className='text-xs' onClick={button.click}>{button.text}</button>}
    </header>
  );
}
