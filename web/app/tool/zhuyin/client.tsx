'use client';

import { useRef, useState } from 'react';
import jsonp from 'jsonp';
import Ad from '../../../component/ad';

export default function Client() {
  const outputRef = useRef<HTMLInputElement>(null);
  const [output, setOutput] = useState('');

  const inputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/([^12347]) /g, '$1=').replace(/,/g, '%2C');

    if (value.trim() === '') {
      setOutput('');
      return;
    }

    jsonp(`https://inputtools.google.com/request?text=${encodeURIComponent(value)}&itc=zh-hant-t-i0-und`, {
      param: 'cb'
    }, (err, data) => {
      console.log(data);
      const result = data[1][0][1][0];
      setOutput(result === undefined ? '' : result);
    });
  };

  const outputClick = (e: React.MouseEvent) => {
    outputRef.current!.select();
  };

  return (
    <main className="[&>div]:text-2xl [&>div]:m-3 [&>div>input]:my-2 [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2 [&>div>input]:w-full">
      <h1 className="m-3 text-3xl font-bold">注音忘記切換輸入法亂碼翻譯器</h1>
      <div>
        <span>輸入</span>
        <input onInput={inputInput} />
      </div>
      <div>
        <span>輸出</span>
        <input value={output} ref={outputRef} readOnly onClick={outputClick} />
      </div>
      <Ad id={5874063928} />
    </main>
  );
}
