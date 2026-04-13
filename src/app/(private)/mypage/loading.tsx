'user client';
const MypageLoading = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {/* 좌측 프로필 카드 */}
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* 프로필 헤더 */}
            <div className="bg-[#af5858] px-5 py-6">
              <div className="flex items-center gap-4">
                {/* 아바타 */}
                <div className="h-20 w-20 rounded-full bg-white/30" />

                {/* 텍스트 */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-24 bg-white/30" />
                  <div className="h-3 w-32 bg-white/30" />
                  <div className="h-3 w-28 bg-white/30" />
                </div>
              </div>
            </div>

            {/* 탭 */}
            <div className="px-3 py-3">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <div className="h-10 w-full rounded-xl" />
                <div className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </aside>

        {/* 우측 콘텐츠 */}
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {/* 헤더 */}
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="h-5 w-32 rounded-md" />
              <div className="mt-2 h-3 w-56 rounded-md" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="px-4 py-5 space-y-4">
              <div className="h-20 w-full rounded-xl" />
              <div className="h-20 w-full rounded-xl" />
              <div className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MypageLoading;
