/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.aladin.co.kr', 'bgzarwiwlgotrmaxmega.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.aladin.co.kr',
        pathname: '/product/**'
      }
    ]
  }
};

export default nextConfig;
