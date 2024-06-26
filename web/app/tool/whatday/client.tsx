'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function Client() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [day, setDay] = useState<string | null>(null);
  const date = useMemo(() => new Date(), []);

  const updateDay = useCallback(() => {
    setDay(days[date.getDay()]);
  }, [date]);

  const inputInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Date.parse(e.target.value);

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
        <input ref={inputRef} defaultValue={date.toISOString().slice(0, 10)} onInput={inputInput} className="border border-black p-2 w-full max-w-80" />
      </div>
      <p className="text-4xl m-3">{day}</p>
    </main>
  );
}
