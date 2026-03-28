const MypageSettingsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 좌측 프로필 카드 */}
        <aside className="w-full lg:w-[280px]">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gray-200 px-5 py-6 flex justify-center">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-300" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-24 rounded bg-gray-300" />
                  <div className="h-3 w-32 rounded bg-gray-300" />
                  <div className="h-3 w-20 rounded bg-gray-300" />
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="px-4 py-4 space-y-2">
              <div className="h-9 w-full rounded-xl bg-gray-200" />
              <div className="h-9 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        </aside>

        {/* 우측 설정 영역 */}
        <main className="flex-1 space-y-4">
          {/* 프로필 섹션 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />

            <div className="space-y-3">
              <div className="h-10 w-full rounded-xl bg-gray-200" />
              <div className="h-10 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="flex justify-end">
              <div className="h-9 w-20 rounded-xl bg-gray-300" />
            </div>
          </div>

          {/* 계정 섹션 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="h-4 w-52 rounded bg-gray-200" />

            <div className="space-y-3">
              <div className="h-10 w-full rounded-xl bg-gray-200" />
            </div>

            <div className="flex justify-end">
              <div className="h-9 w-28 rounded-xl bg-gray-300" />
            </div>
          </div>

          {/* 보안 섹션 */}
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />

            <div className="flex justify-end">
              <div className="h-9 w-32 rounded-xl bg-gray-300" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MypageSettingsSkeleton;
