import Button from '../../common/ui/Button';
import { SkeletonCard } from '../../common/SkeletonGrid';
import { HOME_LIST_SIZE, HOME_SECTIONS, YES24_LIST_LABEL } from '@/shared/lib/yes24/constants';

type HomeBookSectionSkeletonProps = {
  section: (typeof HOME_SECTIONS)[number];
};

// 레이아웃은 HomeBookSection의 목록과 동일하게 유지 (모바일 가로 스크롤, sm 이상 그리드)
export const HomeBookGridSkeleton = () => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-5 lg:gap-8">
      {Array.from({ length: HOME_LIST_SIZE }).map((_, i) => (
        <div key={i} className="w-36 shrink-0 sm:w-auto">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
};

// 제목·탭은 데이터 없이도 알 수 있어 실제 내용을 그대로 표시 (탭 줄바꿈 높이까지 일치)
const HomeBookSectionSkeleton = ({ section }: HomeBookSectionSkeletonProps) => {
  const { emoji, title, tabs } = section;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
      <h2 className="text-lg font-bold sm:text-xl flex items-center gap-2">
        <span aria-hidden>{emoji}</span>
        {title}
      </h2>

      <div className="flex flex-wrap gap-2 py-1">
        {tabs.map((tab, i) => (
          <Button
            key={tab}
            size="xs"
            variant={i === 0 ? 'primary' : 'secondary'}
            label={YES24_LIST_LABEL[tab]}
            disabled
            className="!px-2 !py-1 !text-xs"
          />
        ))}
      </div>

      <HomeBookGridSkeleton />
    </section>
  );
};

export default HomeBookSectionSkeleton;
