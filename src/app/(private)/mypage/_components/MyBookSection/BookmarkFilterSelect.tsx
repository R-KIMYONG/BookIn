import Dropdown, { DropdownItem } from '@/components/common/ui/Dropdown';
import { useBookmarkFilterUrlState } from '@/hooks/url/useBookmarkFilterUrlState';
import { BookmarkFilter } from '@/types/useMypageUrlState.type';
import { FiChevronDown, FiFilter } from 'react-icons/fi';

const FILTER_OPTIONS: { value: BookmarkFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'memo', label: '메모 있음' },
  { value: 'no_memo', label: '메모 없음' },
];
const BookmarkFilterSelect = ({ className }: { className?: string }) => {
  const { bookmarkFilter, setBookmarkFilter } = useBookmarkFilterUrlState();

  const currentLabel = FILTER_OPTIONS.find((option) => option.value === bookmarkFilter)?.label ?? '전체';
  const items: DropdownItem<BookmarkFilter>[] = FILTER_OPTIONS.map((opt) => ({
    type: 'action',
    label: opt.label,
    value: opt.value,
  }));

  return (
    <div className={className}>
      <Dropdown
        align="left"
        trigger={
          <div className="flex items-center gap-2">
            <FiFilter className="h-4 w-4" />

            <span className="text-xs font-medium">{currentLabel}</span>

            <FiChevronDown className="h-4 w-4 opacity-70" />
          </div>
        }
        items={items}
        onSelect={(next) => {
          setBookmarkFilter(next);
        }}
      />
    </div>
  );
};

export default BookmarkFilterSelect;
