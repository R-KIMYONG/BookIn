/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
        pathname: '/product/**',
      },
      {
        protocol: 'https',
        hostname: 'vshtzcektgnzzfgtstdy.supabase.co',
      },
    ],
  },
  transpilePackages: ['framer-motion'],
  reactStrictMode: false,
};

export default nextConfig;
