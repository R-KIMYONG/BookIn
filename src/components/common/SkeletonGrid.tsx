const SkeletonGrid = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="w-full grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full rounded-xl overflow-hidden bg-white shadow-sm animate-pulse">
          <div className="relative aspect-[3/4] bg-gray-200" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-5 w-4/5 rounded bg-gray-200" />
            <div className="h-4 flex items-center justify-between">
              <div className="h-3 w-1/4 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
            <div className="h-3 w-3/5 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
