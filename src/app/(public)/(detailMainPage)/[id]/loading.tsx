'use client';
import { Skeleton } from '@nextui-org/react';

const Loading = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[360px_1fr]">
          {/* Left: Cover Skeleton */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[320px]">
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right: Info Skeleton */}
          <div className="min-w-0">
            <div className="flex flex-col gap-4">
              {/* Title / Author / Category */}
              <div className="min-w-0">
                <Skeleton className="h-7 w-4/5 rounded-lg" />
                <Skeleton className="mt-3 h-5 w-2/5 rounded-lg" />
                <Skeleton className="mt-2 h-4 w-3/5 rounded-lg" />
              </div>

              {/* Description box */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="mt-2 h-4 w-[95%] rounded-lg" />
                <Skeleton className="mt-2 h-4 w-[88%] rounded-lg" />
                <Skeleton className="mt-2 h-4 w-[80%] rounded-lg" />
                <Skeleton className="mt-2 h-4 w-[70%] rounded-lg" />
              </div>
              <div className="rounded-2xl border border-gray-200 px-4 py-4">
                <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                  <Skeleton className="h-4 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-36 rounded-lg" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-3 w-2/3 rounded-lg" />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-11 w-full rounded-xl sm:w-40" />
                <Skeleton className="h-11 w-full rounded-xl sm:w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-white ring-1 ring-black/5">
        <div className="p-5 sm:p-8">
          <div className="flex items-end justify-between">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
          </div>

          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-2/5 rounded-lg" />
                    <Skeleton className="mt-2 h-3 w-1/4 rounded-lg" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-12 rounded-lg" />
                    <Skeleton className="h-7 w-12 rounded-lg" />
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <Skeleton className="h-3 w-full rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-[90%] rounded-lg" />
                  <Skeleton className="mt-2 h-3 w-[80%] rounded-lg" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-3 w-28 rounded-lg" />
                  <Skeleton className="h-3 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Skeleton className="h-9 w-56 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
