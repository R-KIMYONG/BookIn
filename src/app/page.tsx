import Category from '@/components/home/Category';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="px-10 flex-1">
      <Suspense fallback={<div>로딩중</div>}>
        <Category />
      </Suspense>
    </main>
  );
}
