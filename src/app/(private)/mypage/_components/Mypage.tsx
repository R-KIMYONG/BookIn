import MypageSidebar from './MypageSidebar/MypageSidebar';
import MypageContentServer from '../MypageContentServer';
import { MypageProps } from '@/shared/domain/mypage/types';
import { Suspense } from 'react';
import { MYPAGE_DEFAULT_SECTION } from '@/shared/domain/mypage/section';
import RecommendSkeleton from './MypageSkeleton/RecommendSkeleton';
import MyBooksSectionSkeleton from './MypageSkeleton/MyBooksSectionSkeleton';

const Mypage = ({ page, sort, tab, search, memoFilter, searchField, tagId, section }: MypageProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* 상단 프로필 섹션 */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <MypageSidebar />
          </section>
          {/* 본문(내 활동 책) */}
          <Suspense fallback={section === MYPAGE_DEFAULT_SECTION ? <MyBooksSectionSkeleton /> : <RecommendSkeleton />}>
            <MypageContentServer
              page={page}
              sort={sort}
              search={search}
              tab={tab}
              searchField={searchField}
              memoFilter={memoFilter}
              tagId={tagId}
              section={section}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
