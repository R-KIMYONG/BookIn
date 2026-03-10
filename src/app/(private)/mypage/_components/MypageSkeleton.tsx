const MypageSkeleton = () => {
  return (
    <div className="flex justify-between gap-4 sm:w-full mx-auto items-stretch min-h-[calc(100vh-3rem)] animate-pulse">
      <div className="bg-[#af5858] w-1/6 self-stretch flex flex-col items-center justify-center text-xs gap-5">
        <div className="rounded-full bg-white/30 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" />

        <div className="w-16 h-7 rounded-md bg-white/30" />

        <div className="flex flex-col items-center gap-2 w-full px-4">
          <div className="w-20 h-3 rounded bg-white/30" />
          <div className="w-16 h-3 rounded bg-white/30" />
        </div>

        <nav className="w-full px-3">
          <ul className="w-full flex flex-col gap-2">
            <li className="w-full h-10 rounded-md bg-white/20" />
            <li className="w-full h-10 rounded-md bg-white/20" />
          </ul>
        </nav>

        <div className="w-16 h-7 rounded-md bg-white/30" />
      </div>

      <div className="w-5/6 self-stretch flex flex-col justify-between">
        <div className="flex-1 min-h-0 p-6">

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="space-y-4">
              <div className="w-32 h-4 rounded bg-gray-200" />
              <div className="w-full h-12 rounded bg-gray-100" />
              <div className="w-28 h-4 rounded bg-gray-200" />
              <div className="w-full h-12 rounded bg-gray-100" />
              <div className="w-24 h-4 rounded bg-gray-200" />
              <div className="w-full h-12 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageSkeleton;
