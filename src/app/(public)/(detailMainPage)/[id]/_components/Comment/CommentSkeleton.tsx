const CommentSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        {/* 헤더 */}
        <div className="mt-6 flex items-end justify-between">
          <div className="space-y-2 animate-pulse">
            <div className="h-5 w-16 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>
        </div>

        {/* 리스트 */}
        <div className="border-y-2 border-black py-6">
          <ul className="divide-y divide-gray-200">
            {Array.from({ length: count }).map((_, i) => (
              <li key={i} className="py-6">
                <div className="flex gap-4 animate-pulse">
                  {/* 아바타 */}
                  <div className="h-[42px] w-[42px] shrink-0 rounded-full bg-gray-200" />

                  {/* 본문 */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-5/6 rounded bg-gray-200" />
                      <div className="h-3 w-3/5 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
