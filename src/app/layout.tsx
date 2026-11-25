import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import 'react-toastify/dist/ReactToastify.css';
import TopButton from '@/components/common/ui/TopButton';
import QueryProvider from '@/shared/providers/QueryProvider';
import GlobalOverlays from './GlobalOverlays';
import { Noto_Sans_KR } from 'next/font/google';
import { Poppins } from 'next/font/google';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import { SITE_URL } from '@/shared/constants/site';
const poppins = Poppins({ subsets: ['latin'], weight: ['600'], variable: '--font-poppins' });

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-kr',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BookIn',
    template: '%s | BookIn',
  },
  description: '책 추천 및 기록 서비스',
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
  const user = await getCurrentUser();

  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${poppins.variable}`}
    >
      <body className="bg-white">
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
