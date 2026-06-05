'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow, Pin, useMap } from '@vis.gl/react-google-maps';
import Header from '../header';

interface Item {
  name: string,
  latitude: number,
  longitude: number,
  address: string,
  time: string
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
            <h2 className="mb-4 text-xl font-bold"><a className="text-[#1a0dab]" href={`https://www.google.com/search?q=${encodeURIComponent(`7-11 ${name}門市`)}`} target="_blank">7-11 {name}門市</a></h2>}
          <pre className="mb-4 text-base leading-4">{description}</pre>
        </InfoWindow>}
    </>
  );
};

const HeaderWrapper = (
  { setCurrent } :
  { setCurrent: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>> }) => {
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

  return <Header button={{ click: centerOnLocation, text: '以目前位置為中心' }}/>
};

export default function Client(
  { data } :
  { data: Item[] }) {
  const mainRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<google.maps.LatLngLiteral | null>(null);

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

    tokens.push(item.address);
    tokens.push(`營業時間 ${item.time}`);

    return tokens.join('\n\n');
  }, []);

  return <>
    <APIProvider apiKey="AIzaSyCoDq0N1wYtdX_Oien1ZZ-wRhE2tIqHJ4k">
      <HeaderWrapper setCurrent={setCurrent} />
      <main ref={mainRef}>
        <Map defaultBounds={defaultBounds} mapId="vexed.me/sheriff/map" reuseMaps={true}>
          {data.map((item, index) =>
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
