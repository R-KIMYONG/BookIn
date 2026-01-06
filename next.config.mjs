/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.aladin.co.kr', 'vshtzcektgnzzfgtstdy.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
        pathname: '/product/**',
      },
    ],
  },
  transpilePackages: ['@nextui-org/react', 'framer-motion'],
  reactStrictMode: false,
};

export default nextConfig;
