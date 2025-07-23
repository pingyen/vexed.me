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

export default function Client() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const t = formatTime(d);
      document.title = t;
      setTime(t);
      setDate(formatDate(d));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className='font-mono text-center text-7xl sm:text-9xl my-24'>{time}</h1>
      <h2 className='font-mono text-center text-2xl sm:text-4xl'>{date}</h2>
    </>
  );
}
