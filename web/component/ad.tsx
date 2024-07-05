'use client';

import { useEffect } from 'react';

const isProd = process.env.NODE_ENV === 'production';

export default function Ad(
  { id, classes = '' } :
  { id: number, classes?: string }) {
  useEffect(() => {
    if (isProd === false) {
      return;
    }

    const adsbygoogle = window.adsbygoogle;

    if (adsbygoogle === undefined) {
      window.adsbygoogle = [{}];
      return;
    }

    adsbygoogle.push({});
  }, []);

  return isProd === true &&
    <ins className={`adsbygoogle block m-3 ${classes}`} data-ad-client="ca-pub-1821434700708607" data-ad-slot={id} data-ad-format="auto" data-full-width-responsive="true" />;
};
