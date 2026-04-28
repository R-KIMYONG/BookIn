import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import TopButton from '@/components/common/ui/TopButton';
import QueryProvider from './provider';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import ClientProviders from './client-providers';
import GlobalOverlays from './GlobalOverlays';

const inter = Inter({ subsets: ['latin'] });
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
  return (
    <html lang="ko">
      <body className={inter.className}>
        <QueryProvider>
          <GlobalOverlays />
          <Suspense fallback={null}>
            <ClientProviders />
          </Suspense>
          <Header />
          {children}
          <TopButton />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
