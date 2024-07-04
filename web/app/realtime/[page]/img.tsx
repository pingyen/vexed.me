'use client';

import { useRef, useState, useEffect } from 'react';

export default function Img({ src, alt }: { src: string, alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const current = imgRef.current as HTMLImageElement;
    const img = new Image();

    img.addEventListener('load', () => {
      current.className = 'block my-2 w-full max-w-sm';
      current.src = src;
    });

    img.addEventListener('error', () => {
      setError(true);
    });

    img.src = src;
  }, [src]);

  return error === false &&
    <img ref={imgRef} alt={alt} className="hidden" />; // eslint-disable-line @next/next/no-img-element
}
