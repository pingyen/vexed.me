/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/realtime/1',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/realtime/taipei/:slug*',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/realtime/taipei-:slug*',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/daily/:slug*',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/tool/encodeURI',
        destination: '/tool/urlencode',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
