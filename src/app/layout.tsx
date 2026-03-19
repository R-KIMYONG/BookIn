import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import TopButton from '@/components/TopButton';
import QueryProvider from './provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthToastHandler from '@/components/common/AuthToastHandler';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '책in',
  description: '도서 정보 관람이 가능하고, 사용자 간 의견 공유 커뮤니티가 마련되어있는 도서 관련 사이트',
  icons: {
    icon: '/projectbookin.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer autoClose={1000} stacked draggable />
        <QueryProvider>
          <Suspense fallback={null}>
            <AuthToastHandler />
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
