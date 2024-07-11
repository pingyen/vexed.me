'use client';

import { useRef, useState } from 'react';
import Ad from '../../../components/ad';

export default function Client() {
  const inputRef = useRef<HTMLInputElement>(null);
  const methodRef = useRef<HTMLSelectElement>(null);
  const outputRef = useRef<HTMLInputElement>(null);
  const [output, setOutput] = useState('');

  const inputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutput(window[methodRef.current!.value as keyof Window](e.target.value));
  };

  const methodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutput(window[e.target.value as keyof Window](inputRef.current!.value));
  };

  const outputClick = (e: React.MouseEvent) => {
    outputRef.current!.select();
  };

  return (
    <main className="[&>div]:text-3xl [&>div]:m-3 [&>div>span]:mr-3 [&>div>input]:my-2 [&>div>input]:w-full [&>div>input]:max-w-5xl [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
      <h1 className="m-3 text-4xl font-bold">網址編碼解碼</h1>
      <div>
        <span>輸入</span>
        <input ref={inputRef} onInput={inputInput} />
      </div>
      <div>
        <span>方法</span>
        <select ref={methodRef} name="method" onChange={methodChange} className="my-2 w-full max-w-5xl border border-black p-2">
          <option value="encodeURI">encodeURI</option>
          <option value="encodeURIComponent">encodeURIComponent</option>
          <option value="escape">escape</option>
          <option value="decodeURI">decodeURI</option>
          <option value="decodeURIComponent">decodeURIComponent</option>
          <option value="unescape">unescape</option>
        </select>
      </div>
      <div>
        <span>輸出</span>
        <input value={output} ref={outputRef} readOnly onClick={outputClick} />
      </div>
      <Ad id={9481324399} />
    </main>
  );
}
