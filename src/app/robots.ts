import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/constants/site';

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/mypage',
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/auth-code-error',
        '/email-confirmed',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};
export default robots;
