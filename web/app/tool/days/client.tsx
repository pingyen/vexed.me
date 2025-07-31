'use client';

import { useState, useEffect } from 'react';
import Ad from '../../../components/ad';

const formatDate = (value: string): string => {
  const result = value.match(/(\d{4})-?(\d{2})-?(\d{2})/);

  return result !== null
    ? `${result[1]}-${result[2]}-${result[3]}`
    : value;
}

export default function Client() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [days, setDays] = useState<'' | number>(1);

  const startInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    setStart(value);

    const startTime = Date.parse(formatDate(value));

    if (isNaN(startTime) === true) {
      return;
    }

    const endTime = Date.parse(formatDate(end));

    if (isNaN(endTime) === true) {
      if (days === '') {
        return;
      }

      setEnd((new Date(startTime + 86400000 * days)).toISOString().slice(0, 10));
      return;
    }

    setDays(Math.floor((endTime - startTime) / 86400000));
  };

  const endInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    setEnd(value);

    const endTime = Date.parse(formatDate(value));

    if (isNaN(endTime) === true) {
      return;
    }

    let startTime = Date.parse(formatDate(start));

    if (isNaN(startTime) === true) {
      const now = Date.now();
      startTime = now - now / 86400000;
      setStart((new Date(startTime)).toISOString().slice(0, 10));
    }

    setDays(Math.floor((endTime - startTime) / 86400000));
  };

  const daysInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setDays('');
      return;
    }

    const days = parseInt(value);

    setDays(days);

    let startTime = Date.parse(start);

    if (isNaN(startTime) === true) {
      const now = Date.now();
      startTime = now - now / 86400000;
      setStart((new Date(startTime)).toISOString().slice(0, 10));
    }

    setEnd((new Date(startTime + 86400000 * days)).toISOString().slice(0, 10));
  };

  useEffect(() => {
    const now = Date.now();
    const base = now - now / 86400000;
    setStart((new Date(base)).toISOString().slice(0, 10));
    setEnd((new Date(base + 86400000)).toISOString().slice(0, 10));
  }, []);

  return (
    <main className="[&>div]:text-2xl [&>div]:m-3 [&>div>span]:mr-2 [&>div>input]:my-2 [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
      <h1 className="m-3 text-3xl font-bold">日期距離計算機</h1>
      <div>
        <span>開始日期</span>
        <input value={start} onInput={startInput} />
      </div>
      <div>
        <span>結束日期</span>
        <input value={end} onInput={endInput} />
      </div>
      <div>距離 <input type="number" value={days} className="w-32" onInput={daysInput} /> 天 (可以負數)</div>
      <Ad id={3572986606} />
    </main>
  );
}
