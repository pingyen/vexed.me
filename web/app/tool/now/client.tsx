'use client';

import { useState, useEffect } from 'react';

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDay = (date: Date) => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${days[date.getDay()]}`;
};

export default function Client() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const t = formatTime(d);
      document.title = t;
      setTime(t);
      setDate(formatDate(d));
      setDay(formatDay(d));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{'body { background: black; color: wheat }'}</style>
      <main className="font-mono text-center">
        <h1 className='text-7xl sm:text-9xl py-24'>{time}</h1>
        <h2 className='text-2xl sm:text-4xl'>{date}</h2>
        <h3 className='text-xl sm:text-2xl py-1'>{day}</h3>
      </main>
    </>
  );
}
