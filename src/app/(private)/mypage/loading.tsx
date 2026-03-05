'use client';

import { Skeleton } from '@nextui-org/react';

const Loading = () => {
  return (
    <div className="flex justify-between gap-4 sm:w-full mx-auto items-stretch min-h-[calc(100vh-3rem)]">
      {/* 좌측 사이드바 */}
      <div className="bg-[#af5858] w-1/6 self-stretch flex flex-col items-center justify-center text-xs gap-5">
        {/* 아바타 */}
        <Skeleton className="rounded-full w-16 h-16 sm:w-20 sm:h-20 bg-white/30" />

        {/* 업로드 버튼 */}
        <Skeleton className="w-16 h-6 rounded-md bg-white/30" />

        {/* 환영 텍스트 */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-20 h-3 bg-white/30" />
          <Skeleton className="w-24 h-3 bg-white/30" />
        </div>

        {/* 탭 버튼들 */}
        <div className="w-full flex flex-col gap-2 px-4">
          <Skeleton className="w-full h-10 rounded-md bg-white/30" />
          <Skeleton className="w-full h-10 rounded-md bg-white/30" />
        </div>

        {/* 로그아웃 */}
        <Skeleton className="w-16 h-6 rounded-md bg-white/30" />
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div className="w-5/6 self-stretch flex flex-col gap-4 p-6">
        {/* 제목 */}
        <Skeleton className="w-48 h-6 rounded-md" />

        {/* 콘텐츠 블럭 */}
        <Skeleton className="w-full h-32 rounded-lg" />
        <Skeleton className="w-full h-32 rounded-lg" />
        <Skeleton className="w-full h-32 rounded-lg" />
      </div>
    </div>
  );
};

export default Loading;
