import SearchResultSkeleton from './_components/SearchResultSkeleton';

const Loading = () => (
  <>
    {/* SearchOptionView의 header와 같은 여백 */}
    <div className="px-1 py-6 sm:px-6 md:px-10">
      <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
        ))}
      </div>
    </div>
    <SearchResultSkeleton />
  </>
);

export default Loading;
