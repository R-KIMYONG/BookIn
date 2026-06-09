'use client';
import { Flame } from 'lucide-react';
import RankingBoard from './rankingboard/RankingBord';
import TopViewSlide from './topviewslide/TopviewSlide';
import { useTopViewBooks } from '@/hooks/ranking/useTopViewBooks';
import { useRankedBooks } from '@/hooks/ranking/useRankedBooks';

const TopSection = () => {
  const { data: viewBooks = [] } = useTopViewBooks();
  const { data: rankedBooks = [] } = useRankedBooks();
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Flame className="fill-red-500 text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          지금 화제의 책
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">독자들이 가장 많이 보고 반응한 책들을 모았어요</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6 ">
        <TopViewSlide books={viewBooks} />
        <RankingBoard books={rankedBooks} />
      </div>
    </section>
  );
};

export default TopSection;
