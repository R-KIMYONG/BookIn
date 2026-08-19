export const RailsSkeleton = () => (
  <div className="mx-auto w-full py-8">
    {Array.from({ length: 3 }).map((_, r) => (
      <div key={r} className="mb-10">
        {/* 레일 라벨 (아이콘 + 제목) */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        </div>
        {/* 가로 카드 행 */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[150px] shrink-0 animate-pulse">
              <div className="aspect-[3/4] rounded-lg bg-gray-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
