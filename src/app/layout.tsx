import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopButton from '@/components/TopButton';
import QueryProvider from './provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from '@/utils/supabase/server';

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
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer autoClose={1000} stacked draggable />
        <QueryProvider>
          <Header initialIsLoggedIn={!!user} />
          {children}
          <TopButton />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
