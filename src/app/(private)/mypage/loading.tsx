import React from 'react';

const Line = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

const MypageLoading = () => {
  return (
    // <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 overflow-x-hidden">
    //   <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    //     <div className="flex flex-col gap-4">
    //       <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    //         <div className="bg-white px-4 py-3 sm:px-6 border-b border-gray-100">
    //           <div className="flex items-center justify-between gap-3">
    //             <div className="flex items-center gap-3 min-w-0">
    //               <div className="h-11 w-11 rounded-full bg-gray-200 animate-pulse shrink-0" />

    //               <div className="min-w-0 space-y-2">
    //                 <div className="flex items-center gap-2">
    //                   <Line className="h-4 w-28" />
    //                   <Line className="h-3 w-16" />
    //                 </div>
    //                 <Line className="h-3 w-44" />
    //               </div>
    //             </div>

    //             <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
    //           </div>
    //         </div>

    //         <div className="px-3 py-3">
    //           <nav>
    //             <ul className="flex flex-wrap gap-2">
    //               <li>
    //                 <div className="h-9 w-24 rounded-xl bg-gray-200 animate-pulse" />
    //               </li>
    //               <li className="hidden sm:block">
    //                 <div className="h-9 w-24 rounded-xl bg-gray-100" />
    //               </li>
    //             </ul>
    //           </nav>
    //         </div>
    //       </section>

    //       <section className="overflow-hidden shadow-sm">
    //         <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
    //           {/* 탭 스켈레톤 */}
    //           <div className="flex flex-wrap gap-2">
    //             <div className="h-9 w-20 rounded-xl bg-gray-200 animate-pulse" />
    //             <div className="h-9 w-20 rounded-xl bg-gray-100" />
    //             <div className="h-9 w-20 rounded-xl bg-gray-100" />
    //           </div>

    //           {/* 리스트 스켈레톤 */}
    //           <div className="my-2 lg:h-[calc(300px*2+16px)] space-y-3">
    //             <MyBooksSectionSkeleton />
    //           </div>

    //           {/* 페이지 네이션 자리 */}
    //           <div className="w-full flex flex-col items-center gap-3 pt-2">
    //             <div className="px-4 flex items-center gap-2">
    //               <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
    //               <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
    //               <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
    //               <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
    //               <div className="h-9 w-9 rounded-md bg-gray-200 animate-pulse" />
    //             </div>

    //             <div className="flex items-center gap-2">
    //               <div className="h-10 w-44 rounded-full bg-gray-100 animate-pulse" />
    //               <div className="h-10 w-14 rounded-xl bg-gray-200 animate-pulse" />
    //             </div>
    //           </div>
    //         </div>
    //       </section>
    //     </div>
    //   </div>
    // </div>
    <div className="my-2 min-h-[400px]">
      <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
};

export default MypageLoading;
