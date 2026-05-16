'use client';

import Button from '@/components/common/ui/Button';
import Dropdown from '@/components/common/ui/Dropdown';
import { DropdownItem } from '@/components/common/ui/Dropdown/types';
import { FILTER_OPTIONS, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SEARCH_SCOPE, SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort, SORT_OPTIONS } from '@/shared/domain/mybooks/sort';
import { MyBooksTabType } from '@/shared/domain/mypage/tab';
import { Tag } from '@/shared/domain/tag/types';
import { FiArrowDown, FiChevronDown, FiEdit3, FiSearch, FiX } from 'react-icons/fi';
import { HiHashtag } from 'react-icons/hi';

type MyBooksToolbarProps = {
  tab: MyBooksTabType;
  search: string;
  onSearchChange: (value: string) => void;

  searchField: SearchField;
  onSearchFieldChange: (value: SearchField) => void;

  sort: MyBooksSort;
  onSortChange: (value: MyBooksSort) => void;

  filter?: MyBooksFilter;
  onFilterChange?: (value: MyBooksFilter) => void;

  tag?: string;
  onTagChange?: (value: string) => void;
  userTags: Tag[];
};

const getSearchOptions = (tab: MyBooksTabType): DropdownItem<SearchField>[] => {
  const labelMap: Record<SearchField, string> = {
    title: '제목',
    author: '저자',
    memo: '메모',
    content: '댓글',
  };

  return SEARCH_SCOPE[tab].map((key) => ({
    type: 'action',
    label: labelMap[key],
    value: key,
  }));
};

const MyBooksToolbar = ({
  tab,
  search,
  onSearchChange,

  searchField,
  onSearchFieldChange,

  sort,
  onSortChange,

  filter,
  onFilterChange,

  tag,
  onTagChange,
  userTags,
}: MyBooksToolbarProps) => {
  const currentFilterLabel = FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? '전체';
  const filterItems: DropdownItem<MyBooksFilter>[] = FILTER_OPTIONS.map((opt) => ({
    type: 'action',
    label: opt.label,
    value: opt.value,
  }));
  const currentTagLabel = tag ? (userTags.find((t) => t.id === tag)?.name ?? '태그') : '전체 태그';
  const tagItems: DropdownItem<string>[] = [
    { type: 'action' as const, label: '전체 태그', value: '' },
    ...userTags.map((t) => ({
      type: 'action' as const,
      label: t.name,
      value: t.id ? t.id : '',
    })),
  ];

  const currentSortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? '최신순';
  const sortItems: DropdownItem<MyBooksSort>[] = SORT_OPTIONS.map((option) => ({
    type: 'action',
    label: option.label,
    value: option.value,
  }));

  const currentSearchField =
    getSearchOptions(tab).find(
      (option): option is Extract<typeof option, { type: 'action' }> =>
        option.type === 'action' && option.value === searchField
    )?.label ?? '제목';
  const searchFieldItems = getSearchOptions(tab);
  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 px-2">
      {/* 검색 */}
      <div className="flex items-center w-full h-10 px-2 sm:w-[320px] md:w-[380px] lg:w-[320px] border rounded-lg focus-within:ring-1 focus-within:ring-blue-400">
        <Dropdown
          align="left"
          variant="secondary"
          trigger={
            <div className="flex items-center gap-1 h-full">
              <FiSearch className="w-3 h-3 text-gray-500" />

              <span className="text-xs text-gray-700 whitespace-nowrap">{currentSearchField}</span>

              <FiChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          }
          items={searchFieldItems}
          onSelect={(v) => onSearchFieldChange(v)}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`${currentSearchField} 검색...`}
          className="flex-1 h-full px-2 outline-none text-sm bg-transparent"
          maxLength={15}
        />

        {search && <Button size="xs" variant="ghost" onClick={() => onSearchChange('')} label={<FiX />} />}
      </div>

      {/* 정렬 */}
      <Dropdown
        align="left"
        trigger={
          <div className="flex items-center gap-2">
            <FiArrowDown className="h-4 w-4" />

            <span className="text-xs font-medium">{currentSortLabel}</span>

            <FiChevronDown className="h-4 w-4 opacity-70" />
          </div>
        }
        items={sortItems}
        onSelect={(next) => {
          onSortChange(next);
        }}
      />

      {/* 북마크 전용 필터 */}
      {tab === 'bookmark' && onFilterChange && (
        <Dropdown
          align="left"
          trigger={
            <div className="flex items-center gap-2">
              <FiEdit3 className="h-4 w-4" />

              <span className="text-xs font-medium">{currentFilterLabel}</span>

              <FiChevronDown className="h-4 w-4 opacity-70" />
            </div>
          }
          items={filterItems}
          onSelect={(next) => {
            onFilterChange(next);
          }}
        />
      )}
      {tab === 'bookmark' && userTags.length > 0 && onTagChange && (
        <Dropdown
          align="left"
          trigger={
            <div className="flex items-center gap-2">
              <HiHashtag className="h-3 w-3" />

              <span className="text-xs font-medium">{currentTagLabel}</span>

              <FiChevronDown className="h-4 w-4 opacity-70" />
            </div>
          }
          items={tagItems}
          onSelect={(value) => onTagChange(value)}
        />
      )}
    </div>
  );
};

export default MyBooksToolbar;
