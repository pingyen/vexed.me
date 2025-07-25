'use client';

import { useRef, useEffect } from 'react';

export default function Img({ src, alt }: { src: string, alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const current = imgRef.current as HTMLImageElement;

    if (current.complete === true) {
      if (current.naturalWidth === 0) {
        current.style.display = 'none';
      }

      return;
    }

    current.addEventListener('error', function () {
      this.style.display = 'none';
    }, true);
  }, []);

  return <img referrerPolicy="no-referrer" ref={imgRef} src={src} alt={alt} className="block my-2 w-full max-w-sm" />; // eslint-disable-line @next/next/no-img-element
}
