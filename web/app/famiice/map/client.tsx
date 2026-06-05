'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import Header from '../header';

interface Item {
  name: string,
  latitude: number,
  longitude: number,
  address: string,
  twoFlavors: boolean,
  specialShape: boolean
}

const Marker = (
  { position, name, description, children } :
  { position: google.maps.LatLngLiteral, name?: string, description: string, children?: React.ReactNode }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [shown, setShown] = useState(false);

  return (
    <>
      <AdvancedMarker position={position} ref={markerRef} onClick={() => { setShown(true) }}>
        {children}
      </AdvancedMarker>
      {shown &&
        <InfoWindow anchor={marker} onClose={() => { setShown(false) }}>
          {name &&
            <h2 className="mb-4 text-xl font-bold"><a className="text-[#1a0dab]" href={`https://www.google.com/search?q=${encodeURIComponent(name)}`} target="_blank">{name}</a></h2>}
          <pre className="mb-4 text-base leading-4">{description}</pre>
        </InfoWindow>}
    </>
  );
};

const HeaderWrapper = (
  { setCurrent, setTwoFlavorsOnly, setSpecialShapeOnly } :
  { setCurrent: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>,
    setTwoFlavorsOnly: React.Dispatch<React.SetStateAction<boolean>>,
    setSpecialShapeOnly: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const map = useMap();

  const centerOnLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = pos.coords;
      const position = { lat: coords.latitude, lng: coords.longitude }

      if (map !== null) {
        map.setCenter(position);
        map.setZoom(16);
      }

      setCurrent(position);
    }, () => {
      alert('請給予位置權限');
    });
  }, [map, setCurrent]);

  useEffect(() => {
    if (map === null) {
      return;
    }

    const permissions = navigator.permissions;

    if (permissions === undefined ||
        permissions.query === undefined) {
      return;
    }

    permissions.query({ name: 'geolocation' })
      .then(result => {
        if (result.state === 'granted') {
          centerOnLocation();
        }
      });
  }, [map, centerOnLocation]);

  return <Header
    button={{ click: centerOnLocation, text: '以目前位置為中心' }}
    twoFlavorsChange={e => { setTwoFlavorsOnly(e.target.checked); }}
    specialShapeChange={e => { setSpecialShapeOnly(e.target.checked); }}/>
};

export default function Client(
  { data } :
  { data: Item[] }) {
  const mainRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<google.maps.LatLngLiteral | null>(null);
  const [twoFlavorsOnly, setTwoFlavorsOnly] = useState(false);
  const [specialShapeOnly, setSpecialShapeOnly] = useState(false);

  const defaultBounds = useMemo(() => {
    let north = -90;
    let south = 90;
    let east = -180;
    let west = 180;

    for (const item of data) {
      const lat = item.latitude;
      const lng = item.longitude;

      if (lat > north) {
        north = lat;
      } else if (lat < south) {
        south = lat;
      }

      if (lng > east) {
        east = lng;
      } else if (lng < west) {
        west = lng;
      }
    }

    return { north, south, east, west };
  }, [data]);

  useEffect(() => {
    const current = mainRef.current as HTMLElement;
    const unit = /iP(ad|hone)/.test(navigator.userAgent) === true ? 'dvh' : 'vh';
    current.style.height = `calc(100${unit} - ${current.offsetTop}px)`;
  }, []);

  const getDescription = useCallback((item: Item) => {
    const tokens = [];

    if (item.twoFlavors === true) {
      tokens.push('雙口味');
    }

    if (item.specialShape === true) {
      tokens.push('特殊造型');
    }

    tokens.push(item.address);

    return tokens.join('\n\n');
  }, []);

  const items = useMemo(() => {
    const items = [];

    for (const item of data) {
      if ((twoFlavorsOnly === true && item.twoFlavors === false) ||
          (specialShapeOnly  === true && item.specialShape === false)) {
        continue;
      }

      items.push(item);
    }

    return items;
  }, [data, twoFlavorsOnly, specialShapeOnly]);

  return <>
    <APIProvider apiKey="AIzaSyCoDq0N1wYtdX_Oien1ZZ-wRhE2tIqHJ4k">
      <HeaderWrapper setCurrent={setCurrent} setTwoFlavorsOnly={setTwoFlavorsOnly} setSpecialShapeOnly={setSpecialShapeOnly} />
      <main ref={mainRef}>
        <Map defaultBounds={defaultBounds} mapId="vexed.me/famiice/map" reuseMaps={true}>
          {items.map((item, index) =>
            <Marker key={index} position={{ lat: item.latitude, lng: item.longitude }} name={item.name} description={getDescription(item)} />)}
          {current &&
            <Marker position={current} description="目前位置">
              <Pin background="#FFD356" glyphColor="#000" borderColor="#000" />
            </Marker>}
        </Map>
      </main>
    </APIProvider>
  </>;
}
