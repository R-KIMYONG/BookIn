import Category from '@/components/home/Category';
import CategorySkeleton from '@/components/home/CategorySkeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';
export const metadata: Metadata = {
  title: '홈',
};
const Home = () => {
  return (
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      <Suspense fallback={<CategorySkeleton />}>
        <Category />
      </Suspense>
    </main>
  );
};
export default Home;
