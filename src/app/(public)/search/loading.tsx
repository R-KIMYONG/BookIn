const Loading = () => (
  <div className="px-1 py-6 sm:px-6 md:px-10">
    <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
    <div className="mt-3 flex gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
      ))}
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200" />
      ))}
    </div>
  </div>
);
export default Loading;
