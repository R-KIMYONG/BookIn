import SkeletonGrid from '@/components/common/SkeletonGrid';

const Loading = () => {
  return (
    <section className="max-w-7xl m-auto mt-6 flex flex-col px-10 gap-4">
      <div className="border-b pb-3 flex justify-center">
        <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex gap-2 animate-pulse">
        <div className="h-8 w-20 rounded bg-gray-200" />
        <div className="h-8 w-20 rounded bg-gray-200" />
        <div className="h-8 w-20 rounded bg-gray-200" />
      </div>

      <div className="border rounded-lg px-3 w-fit h-fit py-3">
        <div className="flex gap-2 flex-wrap animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-16 rounded bg-gray-200" />
          ))}
        </div>
      </div>

      <div className="w-full flex-1">
        <SkeletonGrid count={20} />
      </div>
    </section>
  );
};

export default Loading;
