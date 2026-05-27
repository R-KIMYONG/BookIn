import MypageSidebar from './MypageSidebar/MypageSidebar';
import { MypageSectionType } from '@/shared/domain/mypage/section';
import MyBooksContainer from './MyBooksContainer';

type MypageProps = {
  section: MypageSectionType;
};

const Mypage = ({ section }: MypageProps) => {
  const renderSection = () => {
    switch (section) {
      case 'myBooks':
        return <MyBooksContainer />;
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
            <MypageSidebar section={section} />
          </section>
          {/* 본문(내 활동 책) */}
          <section className="overflow-hidden shadow-sm">{renderSection()}</section>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
