'use client';

import { useState, useEffect } from 'react';

const formatDate = (iso: string) => `${iso.substring(0, 10)} ${iso.substring(11, 19)}`;

export default function Client() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [timezone, setTimezone] = useState<'utc' | 'local'>('utc');
  const timeOffset = (new Date()).getTimezoneOffset() * -60000;

  const init = () => {
    const date = new Date();
    setTime(Math.floor(date.getTime() / 1000).toString());
    setDate(formatDate(date.toISOString()));
  };

  const timeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTime(value);

    const sec = parseInt(value);

    if (isNaN(sec) === true) {
      return;
    }

    let ms = sec * 1000;

    if (timezone === 'local') {
      ms += timeOffset;
    }

    setDate(formatDate((new Date(ms)).toISOString()));
  };

  const dateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setDate(value);

    let ms = Date.parse(value);

    if (isNaN(ms) === true) {
      return;
    }

    if (timezone === 'utc') {
      ms += timeOffset;
    }

    setTime((ms / 1000).toString());
  };

  const utcChange = () => {
    setTimezone('utc');

    const sec = parseInt(time);

    if (isNaN(sec) === true) {
      init();
      return;
    }

    setDate(formatDate((new Date(sec * 1000)).toISOString()));
  };

  const localChange = () => {
    setTimezone('local');

    const sec = parseInt(time);

    if (isNaN(sec) === true) {
      init();
      return;
    }

    setDate(formatDate((new Date(sec * 1000 + timeOffset)).toISOString()));
  };

  useEffect(init, []);

  return (
    <main className="[&>div]:text-3xl [&>div]:m-3 [&>div>input]:w-full [&>div>input]:max-w-96 [&>div>input]:border [&>div>input]:border-black [&>div>input]:p-2">
      <h1 className="m-3 text-4xl font-bold">Unix Timestamp 與時間日期轉換</h1>
      <div>
        <input value={time} onInput={timeInput} type="number" />
      </div>
      <div>
        <input value={date} onInput={dateInput} />
      </div>
      <div className="[&>label]:mr-4 [&>label>input]:mr-1.5">
        <label><input type="radio" name="timezone" checked={timezone === 'utc'} onChange={utcChange} />UTC</label>
        <label><input type="radio" name="timezone" checked={timezone === 'local'} onChange={localChange} />在地時間</label>
      </div>
    </main>
  );
}
