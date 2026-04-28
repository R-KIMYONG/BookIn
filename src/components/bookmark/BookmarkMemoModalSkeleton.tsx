const BookmarkMemoModalSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* 태그 영역 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* 선택된 태그 줄 */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-gray-200 animate-pulse" />
          ))}
        </div>

        {/* 입력 + 버튼 */}
        <div className="flex gap-2">
          <div className="h-9 flex-1 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-9 w-20 rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* 추천 태그 */}
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <div className="h-[80px] rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* 하단 카운터 */}
      <div className="flex items-center justify-between px-2">
        <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default BookmarkMemoModalSkeleton;
