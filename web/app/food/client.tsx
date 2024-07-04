'use client';

import { useState, useEffect } from 'react';
import data from './data.json';
import Header from './header';

enum SortState {
  UNSORTED = 0,
  SORTING = 1,
  SORTED = 2
}

const distances = new Map();

export default function Client() {
  const [items, setItems] = useState(data);
  const [sortState, setSortState] = useState(distances.size > 0 ? SortState.SORTED : SortState.UNSORTED);

  useEffect(() => {
    if (sortState !== SortState.SORTING) {
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = pos.coords;
      const lat = coords.latitude;
      const lng = coords.longitude;
      const deg2rad = (deg: number) => deg * (Math.PI / 180);

      data.forEach(item => {
        const lat2 = item.latitude;
        const lng2 = item.longitude;
        const dLat = deg2rad(lat2 - lat);
        const dLng = deg2rad(lng2 - lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        distances.set(item, c *  6371); // KM
      });

      data.sort((a, b) => distances.get(a) - distances.get(b));
      setItems(data.slice());
      setSortState(SortState.SORTED);
    }, () => {
      alert('請給予位置權限');
      setSortState(SortState.UNSORTED);
    });
  }, [sortState]);

  return <>
    <Header button={sortState === SortState.UNSORTED ? { click: () => { setSortState(SortState.SORTING) }, text: '以距離排序' } : undefined} />
    <main>
      {items.map(({ name, description }, index) =>
        <article key={index} className={`m-3 p-4 border rounded shadow ${sortState === SortState.SORTING && 'animate-pulse'}`}>
          <h2 className="mb-4 text-2xl font-bold"><a className="text-[#1a0dab]" href={`https://www.google.com/search?q=${encodeURIComponent(name)}`} target="_blank">{name}</a></h2>
          <pre className="leading-4">{description}</pre>
        </article>
      )}
    </main>
  </>;
}
