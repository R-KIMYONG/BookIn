'use client';
import { MypageUserInfo } from '@/types/userInfo.type';
import { ReactElement } from 'react';
import MypageSidebar from './MypageSidebar/MypageSidebar';
import MyBooksSection from './MyBookSection/MyBooksSection';
import { useMypageQueryState } from '@/hooks/useMypageQueryState';

const Mypage = ({ userInfo }: { userInfo: MypageUserInfo }): ReactElement => {
  const { query } = useMypageQueryState();

  const renderSection = () => {
    switch (query.section) {
      case 'myBooks':
        return <MyBooksSection userInfo={userInfo} />;
      case 'recommend':
        return <div className="mx-auto w-1/2 text-center py-10">서비스 준비중...</div>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* 상단 프로필 섹션 */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <MypageSidebar userInfo={userInfo} />
          </section>

          {/* 본문(내 활동 책) */}
          <section className="overflow-hidden shadow-sm">
            {/* {query.section === 'myBooks' && <MyBooksSection userInfo={userInfo} />} */}
            {renderSection()}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
