import Button from '@/components/common/ui/Button';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import { YES24_LIST_LABEL } from '@/shared/lib/yes24/constants';
import { Yes24ListType } from '@/shared/lib/yes24/types';

type CategoryListSkeletonProps = {
  tabs: Yes24ListType[];
  active: Yes24ListType;
};

// 탭은 데이터 없이도 알 수 있어 실제 탭을 그대로 표시 (CategoryList와 같은 순서·간격)
const CategoryListSkeleton = ({ tabs, active }: CategoryListSkeletonProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 py-1">
        {tabs.map((tab) => (
          <Button
            key={tab}
            size="xs"
            variant={tab === active ? 'primary' : 'secondary'}
            label={YES24_LIST_LABEL[tab]}
            disabled
            className="!px-2 !py-1 !text-xs"
          />
        ))}
      </div>
      <SkeletonGrid count={20} />
      {/* BookListView의 페이지네이션 자리 */}
      <div className="mt-6 min-h-[2rem]" />
    </>
  );
};

export default CategoryListSkeleton;
