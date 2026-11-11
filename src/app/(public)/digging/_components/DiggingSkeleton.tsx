import DiggingWrapper from './DiggingWrapper';
const DiggingSkeleton = () => (
  <DiggingWrapper>
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
        <div className="h-7 w-16 animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
    </div>
    <div className="flex items-center gap-3">
      <div className="h-8 w-9 shrink-0 animate-pulse rounded-xl bg-gray-100" />
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  </DiggingWrapper>
);

export default DiggingSkeleton;
