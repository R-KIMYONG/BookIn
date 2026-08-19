export const TasteReportSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-4 lg:flex-row lg:items-stretch">
    {/* 차트 카드 */}
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:flex-1">
      <div className="flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-gray-200" />
        <div className="h-6 w-32 rounded bg-gray-200" />
      </div>
      <div className="mx-auto my-6 h-40 w-40 rounded-full bg-gray-100" /> {/* 도넛/레이더 자리 */}
      <div className="flex gap-2">
        <div className="h-7 w-24 rounded-full bg-gray-100" />
        <div className="h-7 w-20 rounded-full bg-gray-100" />
      </div>
    </div>

    {/* AI 카드 */}
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 lg:flex-1">
      <div className="h-4 w-24 rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-200" />
      <div className="h-4 w-5/6 rounded bg-gray-200" />
      <div className="h-16 w-full rounded-xl bg-gray-100" /> {/* 🔮 배너 자리 */}
      <div className="mx-auto h-5 w-2/3 rounded bg-gray-200" /> {/* 도장 자리 */}
    </div>
  </div>
);
