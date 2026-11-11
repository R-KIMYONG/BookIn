import SkeletonGrid from '@/components/common/SkeletonGrid';

// 카테고리 간 이동 시 page.tsx 전체 대신 보이는 화면 → 현재 레이아웃(경로 → 칩 → 탭 → 카드)과 같은 모양
const Loading = () => {
  return (
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      <section className="w-full max-w-7xl mx-auto mt-6 flex flex-col px-4 sm:px-6 gap-4">
        <div className="flex flex-col gap-2 animate-pulse">
          {/* 경로 드롭다운 */}
          <div className="flex items-center gap-2 py-0.5">
            <div className="h-5 w-16 rounded bg-gray-200" />
            <div className="h-5 w-20 rounded bg-gray-200" />
          </div>
          {/* 칩 */}
          <div className="mt-2 flex gap-2 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[30px] w-16 shrink-0 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 py-1 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-16 rounded-xl bg-gray-200" />
          ))}
        </div>

        <SkeletonGrid count={20} />
      </section>
    </main>
  );
};

export default Loading;
