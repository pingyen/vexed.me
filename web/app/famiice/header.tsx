'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Client(
  { button, twoFlavorsChange, specialShapeChange } :
  { button: { click: React.MouseEventHandler<HTMLButtonElement>, text: string } | undefined,
    twoFlavorsChange: React.ChangeEventHandler<HTMLInputElement>,
    specialShapeChange: React.ChangeEventHandler<HTMLInputElement> }) {
  const current = 'font-bold text-red-600 border-b-4 border-red-600';
  const pathname = usePathname();

  return (
    <header className="mx-3 mb-3 *:inline-block">
      <h1 className="text-4xl font-bold relative top-2 mb-1">全家 Fami!ce 霜淇淋</h1>
      <nav className="ml-2 mt-2">
        <ul className="[&>li]:inline-block [&>li>a]:p-1">
          <li><Link href="/famiice" className={pathname === '/famiice' ? current : undefined} >列表</Link></li>
          <li><Link href="/famiice/map" className={pathname === '/famiice/map' ? current : undefined}>地圖</Link></li>
        </ul>
      </nav>
      {button !== undefined &&
        <button className='text-sm ml-2 pt-4 pb-3 active:scale-95' onClick={button.click}>{button.text}</button>}
      <label className='text-sm ml-2 pt-4 pb-3 active:scale-95'>
        <input type="checkbox" className='align-[-2px] mr-1' onChange={twoFlavorsChange} />
        雙口味
      </label>
      <label className='text-sm ml-2 pt-4 pb-3 active:scale-95'>
        <input type="checkbox" className='align-[-2px] mr-1' onChange={specialShapeChange} />
        特殊造型
      </label>
    </header>
  );
}
