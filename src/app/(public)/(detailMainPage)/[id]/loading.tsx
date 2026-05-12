const Box = ({ className }: { className?: string }) => <div className={`bg-gray-200 animate-pulse ${className}`} />;

const Loading = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <div className="rounded-2xl bg-white shadow ring-1 ring-black/5">
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[360px_1fr]">
          {/* Left */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[320px]">
              <Box className="aspect-[3/4] w-full rounded-2xl" />
              <div className="mt-4 flex gap-2">
                <Box className="h-6 w-28 rounded-full" />
                <Box className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            <Box className="h-7 w-4/5 rounded-lg" />
            <Box className="h-5 w-2/5 rounded-lg" />
            <Box className="h-4 w-3/5 rounded-lg" />

            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
              <Box className="h-4 w-full" />
              <Box className="h-4 w-[90%]" />
              <Box className="h-4 w-[80%]" />
            </div>

            <div className="p-4 border rounded-2xl space-y-2">
              <Box className="h-4 w-20" />
              <Box className="h-8 w-36" />
            </div>

            <div className="flex gap-3">
              <Box className="h-11 w-40 rounded-xl" />
              <Box className="h-11 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
