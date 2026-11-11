import Yes24Attribution from '@/components/common/Yes24Attribution';
import HomeBookSectionServer from '@/components/home/homesection/HomeSectionServer';
import HomeBookSectionSkeleton from '@/components/home/homesection/HomeBookSectionSkeleton';
import RecentBooksServer from '@/components/home/recentbooks/RecentBooksServer';
import RecentBooksSkeleton from '@/components/home/recentbooks/RecentBooksSkeleton';
import TopSectionServer from '@/components/home/topsection/TopSectionServer';
import TopSectionSkeleton from '@/components/home/topsection/TopSectionSkeleton';
import { HOME_SECTIONS } from '@/shared/lib/yes24/constants';
import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
const Home = () => {
  return (
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      <Suspense fallback={<TopSectionSkeleton />}>
        <TopSectionServer />
      </Suspense>
      <Suspense fallback={<RecentBooksSkeleton />}>
        <RecentBooksServer />
      </Suspense>
      {HOME_SECTIONS.map((section) => (
        <Suspense key={section.categoryId} fallback={<HomeBookSectionSkeleton section={section} />}>
          <HomeBookSectionServer section={section} />
        </Suspense>
      ))}
      <Yes24Attribution />
    </main>
  );
};
export default Home;
