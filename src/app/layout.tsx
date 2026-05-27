import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from '@/shared/lib/supabase/server';
import TopButton from '@/components/common/ui/TopButton';
import QueryProvider from '@/shared/providers/QueryProvider';
import GlobalOverlays from './GlobalOverlays';
import { Noto_Sans_KR, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-kr',
  display: 'swap',
  preload: true,
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
  preload: false,
});

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sc',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'BookIn',
    template: '%s | BookIn',
  },
  description: '책 추천 및 기록 서비스',
  icons: {
    icon: '/projectbookin.ico',
  },
  openGraph: {
    title: 'BookIn',
    description: '책 추천 및 기록 서비스',
    url: 'https://book-in-two.vercel.app/',
    siteName: 'BookIn',
    images: [
      {
        url: 'https://book-in-two.vercel.app/images/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSansJP.variable} ${notoSansSC.variable}`}>
      <body>
        <QueryProvider initialUser={user}>
          <GlobalOverlays />
          <Header />
          {children}
          <TopButton />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
