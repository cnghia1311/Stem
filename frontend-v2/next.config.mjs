/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.1.110'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3000/api/:path*',
      },
      {
        source: '/apps/:path*',
        destination: 'http://127.0.0.1:3000/apps/:path*',
      },
    ]
  },
}

export default nextConfig
