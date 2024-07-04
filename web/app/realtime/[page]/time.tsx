'use client';

import { useState, useMemo, useEffect } from 'react';

const formatDate = (date: Date, format: string) => {
  const padZero = (value: number) => value < 10 ? `0${value}` : value.toString();

  const parts = new Map<string, string>([
    ['Y', date.getFullYear().toString()],
    ['m', padZero(date.getMonth() + 1)],
    ['d', padZero(date.getDate())],
    ['H', padZero(date.getHours())],
    ['i', padZero(date.getMinutes())],
    ['s', padZero(date.getSeconds())]
  ]);

  return format.replace(/Y|m|d|H|i|s/g, match => parts.get(match) as string);
};

export default function Time(
  { timestamp } :
  { timestamp: number }) {
  const date = useMemo(() => new Date(timestamp * 1000), [timestamp]);
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(formatDate(date, 'Y-m-d H:i:s'));
  }, [date]);

  return <time dateTime={date.toISOString()} className="mx-2">{text}</time>;
}
