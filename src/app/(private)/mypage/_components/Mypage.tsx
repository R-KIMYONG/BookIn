'use client';
import { MypageUserInfo } from '@/types/userInfo.type';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';
import { ReactElement } from 'react';
import MypageSidebar from './MypageSidebar/MypageSidebar';
import MyBooksSection from './MyBookSection/MyBooksSection';

const Mypage = ({ userInfo }: { userInfo: MypageUserInfo }): ReactElement => {
  const { mypageSection } = useMypageUrlState();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {/* 모바일: 상단 프로필 카드 / 데스크톱: 좌측 패널 */}
        <aside className="w-full lg:w-[280px] lg:shrink-0">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24">
            <MypageSidebar userInfo={userInfo} />
          </div>
        </aside>

        {/* 본문 */}
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
              <h3 className="text-base font-extrabold text-gray-900 sm:text-lg">내 활동 책</h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">좋아요, 북마크, 댓글 활동을 확인할 수 있습니다.</p>
            </div>

            <div className="px-4 py-5 sm:px-6">
              {mypageSection === 'myBooks' && <MyBooksSection userInfo={userInfo} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mypage;
