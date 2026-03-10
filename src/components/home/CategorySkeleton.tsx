const CategorySkeleton = () => {
  //최대한 가볍게
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between">
        {/* 탭 */}
        <div className="flex flex-wrap gap-2 md:max-w-[60%]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-16 rounded-md bg-gray-200" />
          ))}
        </div>
        {/* 검색창 */}
        <div className="w-full md:w-[280px]">
          <div className="h-9 w-full rounded-2xl bg-gray-200" />
        </div>
      </div>
      {/* 책 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-56 rounded-xl bg-gray-200 sm:h-60 md:h-60" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
