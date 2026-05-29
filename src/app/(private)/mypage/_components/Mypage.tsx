import MypageSidebar from './MypageSidebar/MypageSidebar';
import MypageContent from './MypageContent';

const Mypage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-2 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* 상단 프로필 섹션 */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <MypageSidebar />
          </section>
          {/* 본문(내 활동 책) */}
          <MypageContent />
        </div>
      </div>
    </div>
  );
};

export default Mypage;
