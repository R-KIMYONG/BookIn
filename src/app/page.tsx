import Category from '@/components/home/Category';
import CategorySkeleton from '@/components/home/CategorySkeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="px-10 flex-1">
      <Suspense fallback={<CategorySkeleton />}>
        <Category />
      </Suspense>
    </main>
  );
}
