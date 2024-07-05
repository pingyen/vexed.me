'use client';

import { useEffect } from 'react';

export default function Client(
  { page, lastUrl } :
  { page: number, lastUrl: string }) {
  useEffect(() => {
    const prevPage = sessionStorage.page;
    const prevLastUrl = sessionStorage.lastUrl;

    if (prevPage !== undefined &&
        prevLastUrl !== undefined &&
        page === parseInt(prevPage) + 1) {
      document.querySelector(`a[href="${prevLastUrl}"]`)?.scrollIntoView({ behavior: 'smooth' });
    }

    sessionStorage.page = page;
    sessionStorage.lastUrl = lastUrl;
  }, [page, lastUrl]);

  useEffect(() => {
    if (navigator.userAgent.indexOf('Mobile') === -1) {
      return;
    }

    document.querySelectorAll('main > article a').forEach(anchor => {
      anchor.removeAttribute('target');
    });
  }, []);

  return <style jsx global>{`body { background: #DDD }`}</style>;
}
