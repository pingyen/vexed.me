'use client';

import { useRef, useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow, Pin, type MapCameraProps, type MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import Header from '../header';
interface Item {
  name: string,
  description: string,
  latitude: number;
  longitude: number;
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

export default function Client(
  { data } :
  { data: Item[] }) {
  const mainRef = useRef<HTMLElement>(null);
  const [camera, setCamera] = useState<MapCameraProps | null>(null);
  const [current, setCurrent] = useState<google.maps.LatLngLiteral | null>(null);

  const defaultBounds = (() => {
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
  })();

  useEffect(() => {
    const current = mainRef.current as HTMLElement;
    const unit = /iP(ad|hone)/.test(navigator.userAgent) === true ? 'dvh' : 'vh';
    current.style.height = `calc(100${unit} - ${current.offsetTop}px)`;
  }, []);

  const centerOnLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = pos.coords;
      const position = { lat: coords.latitude, lng: coords.longitude }

      setCamera({ center: position, zoom: 16 });
      setCurrent(position);
    }, () => {
      alert('請給予位置權限');
    });
  };

  useEffect(() => {
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
  }, []);

  const cameraChanged = (e: MapCameraChangedEvent) => {
    setCamera(e.detail);
  };

  return <>
    <Header button={{ click: centerOnLocation, text: '以目前位置為中心' }} />
    <main ref={mainRef}>
      <APIProvider apiKey="AIzaSyCoDq0N1wYtdX_Oien1ZZ-wRhE2tIqHJ4k">
        <Map defaultBounds={defaultBounds} {...camera} onCameraChanged={cameraChanged} mapId="vexed.me/food/map" reuseMaps={true}>
            {data.map((item, index) =>
              <Marker key={index} position={{ lat: item.latitude, lng: item.longitude }} name={item.name} description={item.description} />)}
            {current &&
              <Marker position={current} description="目前位置">
                <Pin background="#FFD356" glyphColor="#000" borderColor="#000" />
              </Marker>}
        </Map>
      </APIProvider>
    </main>
  </>;
}
