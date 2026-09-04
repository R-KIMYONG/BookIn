const Loading = () => (
  <div className="min-h-[calc(100dvh-6rem)] w-full max-w-7xl bg-gray-50 flex items-center justify-center px-6 py-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 w-full animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
export default Loading;
