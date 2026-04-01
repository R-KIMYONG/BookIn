
const SkeletonGrid = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-5 p-4 rounded-xl border animate-pulse">
          {/* 이미지 */}
          <div className="h-24 rounded-lg bg-gray-200" />

          {/* 텍스트 */}
          <div className="space-y-3">
            <div className="h-3 w-3/5 rounded bg-gray-200" />
            <div className="h-3 w-4/5 rounded bg-gray-200" />
            <div className="h-3 w-2/5 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
