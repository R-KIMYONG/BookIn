import { Flame, Trophy } from 'lucide-react';

// 랭킹은 TOP 10 기준 (RankingBoard가 최대 10줄 표시)
const RANKING_ROWS = 10;

const TopSectionSkeleton = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Flame className="fill-red-500 text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
          지금 화제의 책
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">독자들이 가장 많이 보고 반응한 책들을 모았어요</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6">
        {/* 슬라이드 + 네비게이션 바 */}
        <div className="w-full min-w-0 animate-pulse">
          <div className="w-full h-[300px] sm:h-[350px] lg:h-[450px] rounded-2xl bg-gray-200" />
          <div className="mt-2 h-7 w-full max-w-[350px] rounded bg-gray-200" />
        </div>

        {/* 종합 랭킹 */}
        <aside className="w-full rounded-2xl bg-white shadow-md ring-1 ring-black/5 flex flex-col overflow-hidden self-start">
          <div className="flex items-center gap-1.5 px-4 h-[57px] border-b text-base font-bold">
            <Trophy className="w-4 h-4 text-[#af5858]" />
            종합 랭킹
          </div>
          <div className="py-1 animate-pulse">
            {Array.from({ length: RANKING_ROWS }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 h-9">
                <div className="h-3 w-7 shrink-0 rounded bg-gray-200" />
                <div className="h-5 w-5 shrink-0 rounded-lg bg-gray-200" />
                <div className="h-3 flex-1 rounded bg-gray-200" />
                <div className="h-3 w-20 shrink-0 rounded bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="h-7 bg-gray-100 animate-pulse" />
        </aside>
      </div>
    </section>
  );
};

export default TopSectionSkeleton;
