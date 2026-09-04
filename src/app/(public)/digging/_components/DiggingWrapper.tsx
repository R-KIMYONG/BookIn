import { ReactNode } from 'react';

const DiggingWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-[calc(100dvh-6rem)] w-full max-w-7xl py-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center px-6">
      <div
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-sm
                  p-6 sm:p-8 flex flex-col gap-6"
      >
        {children}
      </div>
    </div>
  );
};

export default DiggingWrapper;
