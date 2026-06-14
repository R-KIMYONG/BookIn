export const SkeletonView = ({ analyzing }: { analyzing?: boolean }) => (
  <div className="mx-auto w-full py-8">
    <h2 className="mb-4 text-2xl font-bold">{analyzing ? '✨ AI가 취향을 분석 중...' : '✨ AI가 분석한 독서 취향'}</h2>
    <div className="mb-10 h-20 animate-pulse rounded-xl bg-gray-100" />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mt-1 h-3 w-1/2 rounded bg-gray-200" />
          <div className="mt-1.5 h-12 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  </div>
);
