/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/realtime/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=180'
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/realtime/1',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/realtime/taipei/(.*)',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/realtime/taipei-(.*)',
        destination: '/realtime',
        permanent: true
      },
      {
        source: '/daily/(.*)',
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
