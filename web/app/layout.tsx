import './globals.css';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1821434700708607" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId="G-V4ZGLPVVER" />
    </html>
  );
}
