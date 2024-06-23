'use client';

import { useState, useEffect } from 'react';

const formatNumber = (num: number) =>
  num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  });

export default function Client() {
  const [size, setSize] = useState('15.6');
  const [ratio, setRatio] = useState('16:9');
  const [custom, setCustom] = useState('256:135');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [area, setArea] = useState(0);

  const sizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
  };

  const ratioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRatio(e.target.value);
  };

  const customInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustom(e.target.value);
    setRatio('custom');
  };

  useEffect(() => {
    let chunks;

    if (ratio === 'custom') {
      if (/\d+:\d+/.test(custom) === false) {
        setWidth(0);
        setHeight(0);
        setArea(0);
        return;
      }

      chunks = custom.split(':');
    } else {
      chunks = ratio.split(':');
    }

    const a = Number(chunks[0]);
    const b = Number(chunks[1]);
    const c = Math.sqrt(a * a + b * b);
    const s = Number(size);
    const w = s * a / c;
    const h = s * b / c;

    setWidth(w);
    setHeight(h);
    setArea(w * h);
  }, [size, ratio, custom]);

  return (
    <main className="[&>div]:text-2xl [&>div]:m-3">
      <h1 className="m-3 text-3xl font-bold">螢幕尺寸寬高面積對角線長換算</h1>
      <div>螢幕尺寸 <input value={size} onInput={sizeInput} type="number" min="0" className="my-2 border border-black p-2 w-32" /> 吋</div>
      <div className="[&>label]:inline-block [&>label]:m-3 [&>label>input]:mr-2" >長寬比
        <label>
          <input type="radio" name="ratio" value="16:9" checked={ratio === '16:9'} onChange={ratioChange} />
          16:9
        </label>
        <label>
          <input type="radio" name="ratio" value="4:3" checked={ratio === '4:3'} onChange={ratioChange}/>
          4:3
        </label>
        <label>
          <input type="radio" name="ratio" value="custom" checked={ratio === 'custom'} onChange={ratioChange}/>
          <input value={custom} onInput={customInput} className="border border-black p-2 w-32" />
        </label>
      </div>
      <div>寬 {formatNumber(width)} 吋 {formatNumber(width * 2.54)} 公分</div>
      <div>高 {formatNumber(height)} 吋 {formatNumber(height * 2.54)} 公分</div>
      <div>面積 {formatNumber(area)} 平方吋 {formatNumber(area * 2.54 * 2.54)} 平方公分</div>
      <div>對角線 {formatNumber(Number(size))} 吋 {formatNumber(Number(size) * 2.54)} 公分</div>
    </main>
  );
}
