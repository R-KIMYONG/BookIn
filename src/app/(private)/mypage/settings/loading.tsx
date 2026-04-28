const Line = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

const Block = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);
const SettingsLoading = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-9 w-28 rounded-xl bg-gray-100 animate-pulse" />
         

              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-gray-200 animate-pulse" />
                <Line className="h-6 w-32" />
              </div>
              <Line className="h-4 w-64" />
            </div>
            <div className="h-10 w-24 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="border-b border-gray-100 bg-gray-50/60 p-5 lg:border-b-0 lg:border-r lg:border-gray-100 lg:p-6">
            <div className="mx-auto flex max-w-xs flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />

              <div className="mt-5 w-full space-y-2">
                <Line className="h-5 w-28 mx-auto" />
                <Line className="h-4 w-44 mx-auto" />
                <Line className="h-3 w-20 mx-auto" />
              </div>
              <div className="mt-6 w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
                <Line className="h-4 w-20" />
                <div className="mt-3 space-y-4">
                  <div className="space-y-2">
                    <Line className="h-3 w-16" />
                    <Line className="h-4 w-28" />
                  </div>
                  <div className="space-y-2">
                    <Line className="h-3 w-16" />
                    <Line className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <section className="p-5 sm:p-6">
            <div className="space-y-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 space-y-2">
                  <Line className="h-5 w-16" />
                  <Line className="h-4 w-48" />
                </div>

                <div className="space-y-3">
                  <Block className="h-10 w-full" />

                  <div className="flex justify-end">
                    <Block className="h-9 w-24" />
                  </div>
                </div>
              </section>

              {/* 계정 */}

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 space-y-2">
                  <Line className="h-5 w-16" />

                  <Line className="h-4 w-56" />
                </div>

                <div className="space-y-3">
                  <Block className="h-10 w-full" />

                  <div className="flex justify-end">
                    <Block className="h-9 w-28" />
                  </div>
                </div>
              </section>
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-4 space-y-2">
                  <Line className="h-5 w-16" />
                  <Line className="h-4 w-64" />
                </div>
                <div className="space-y-3">
                  <Block className="h-10 w-full" />
                  <Block className="h-10 w-full" />
                  <div className="flex justify-end">
                    <Block className="h-9 w-28" />
                  </div>
                </div>
              </section>
              <section className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Line className="h-5 w-24 bg-red-200" />
                    <Line className="h-4 w-48" />
                    <Line className="h-4 w-56" />
                  </div>
                  <div className="shrink-0">
                    <div className="h-10 w-28 rounded-xl bg-red-200/60 animate-pulse" />
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsLoading;
