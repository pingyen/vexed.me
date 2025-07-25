'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Ad from '../../../components/ad';

const days = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];

export default function Client() {
  const [day, setDay] = useState<string | null>(null);
  const date = useMemo(() => new Date(), []);

  const updateDay = useCallback(() => {
    setDay(days[date.getDay()]);
  }, [date]);

  const inputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    let value = target.value;

    const result = value.match(/(\d{4})(\d{2})(\d{2})/);

    if (result !== null) {
      value = `${result[1]}-${result[2]}-${result[3]}`;
      target.value = value;
    }

    const time = Date.parse(value);

    if (isNaN(time) === true) {
      setDay('------------');
      return;
    }

    date.setTime(time);
    updateDay();
  };

  useEffect(updateDay, [updateDay]);

  return (
    <main>
      <h1 className="m-3 text-3xl font-bold">這天星期幾？</h1>
      <div className="text-3xl m-3">
        <input defaultValue={(new Date(date.getTime() - date.getTimezoneOffset() * 60000)).toISOString().slice(0, 10)} onInput={inputInput} className="border border-black p-2 w-full max-w-80" />
      </div>
      <p className="text-4xl m-3">{day}</p>
      <Ad id={2132839991} />
    </main>
  );
}
