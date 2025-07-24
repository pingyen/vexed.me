'use client';

import { useState, useEffect } from 'react';
import Header from './header';

interface Item {
  name: string,
  latitude: number,
  longitude: number,
  address: string,
  twoFlavors: boolean,
  specialShape: boolean,
  distance?: number
}

enum SortState {
  UNSORTED = 0,
  SORTING = 1,
  SORTED = 2
}

export default function Client(
  { data } :
  { data: Item[] }) {
  const [items, setItems] = useState(data);
  const [sortState, setSortState] = useState(items[0]?.distance !== undefined ? SortState.SORTED : SortState.UNSORTED);
  const [twoFlavorsOnly, setTwoFlavorsOnly] = useState(false);
  const [specialShapeOnly, setSpecialShapeOnly] = useState(false);

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

        item.distance = c *  6371; // KM
      });

      data.sort((a, b) => a.distance as number - (b.distance as number));
      setItems(data.slice());
      setSortState(SortState.SORTED);
    }, () => {
      alert('請給予位置權限');
      setSortState(SortState.UNSORTED);
    });
  }, [data, sortState]);

  const formatDistance = (distance: number) => {
    return distance < 1 ?
      `${(distance * 1000).toFixed(0)} 公尺` :
      `${distance.toFixed(2)} 公里`;
  };

  return <>
    <Header
      button={sortState === SortState.UNSORTED ? { click: () => { setSortState(SortState.SORTING) }, text: '以距離排序' } : undefined}
      twoFlavorsChange={e => { setTwoFlavorsOnly(e.target.checked); }}
      specialShapeChange={e => { setSpecialShapeOnly(e.target.checked); }}/>
    <main>
      {items.map(({ name, address, twoFlavors, specialShape, distance }, index) =>
        (twoFlavorsOnly === true && twoFlavors === false) || (specialShapeOnly  === true && specialShape === false) ? null :
          <article key={index} className={`m-3 p-4 border rounded-sm shadow-custom ${sortState === SortState.SORTING && 'animate-pulse'}`}>
            <h2 className="mb-2 text-2xl font-bold"><a className="text-[#1a0dab]" href={`https://www.google.com/search?q=${encodeURIComponent(name)}`} target="_blank">{name}</a></h2>
            {distance !== undefined &&
              <p className="mb-2">{formatDistance(distance)}</p>}
            {twoFlavors === true && <p className="mb-2">雙口味</p>}
            {specialShape === true && <p className="mb-2">特殊造型</p>}
            <p>{address}</p>
          </article>
      )}
    </main>
  </>;
}
