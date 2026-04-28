import Dropdown, { DropdownItem } from '@/components/common/ui/Dropdown';
import { useBookmarkSortUrlState } from '@/hooks/url/useBookmarkSortUrlState';
import { BookmarkSort } from '@/types/useMypageUrlState.type';
import { FiChevronDown } from 'react-icons/fi';
import { FiArrowDown } from 'react-icons/fi';

const SORT_OPTIONS: { value: BookmarkSort; label: string }[] = [
  { value: 'created_desc', label: '최신 북마크순' },
  { value: 'created_asc', label: '오래된 북마크순' },
  { value: 'title_asc', label: '제목 오름차순' },
  { value: 'title_desc', label: '제목 내림차순' },
];

const BookmarkSortSelect = ({ className }: { className?: string }) => {
  const { bookmarkSort, setBookmarkSort } = useBookmarkSortUrlState();

  const currentLabel = SORT_OPTIONS.find((option) => option.value === bookmarkSort)?.label ?? '최신 북마크순';

  const items: DropdownItem<BookmarkSort>[] = SORT_OPTIONS.map((option) => ({
    type: 'action',
    label: option.label,
    value: option.value,
  }));
  return (
    <div className={className}>
      <Dropdown
        align="left"
        trigger={
          <div className="flex items-center gap-2">
            <FiArrowDown className="h-4 w-4" />

            <span className="text-xs font-medium">{currentLabel}</span>

            <FiChevronDown className="h-4 w-4 opacity-70" />
          </div>
        }
        items={items}
        onSelect={(next) => {
          setBookmarkSort(next);
        }}
      />
    </div>
  );
};

export default BookmarkSortSelect;
