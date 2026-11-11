import { Clock } from 'lucide-react';

const RecentBooksSkeleton = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#af5858]" />
        최근 본 책
      </h2>
      <div className="flex gap-4 overflow-hidden pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[120px] sm:w-[140px] animate-pulse">
            <div className="aspect-[3/4] rounded-lg bg-gray-200" />
            <div className="mt-2 h-5 rounded bg-gray-200" />
            <div className="mt-2 h-[16.5px] w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentBooksSkeleton;
