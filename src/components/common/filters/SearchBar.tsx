import { FormEvent, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import ButtonComponent from '../ButtonComponent';
import { SearchQueryType } from '@/types/searchBar.type';

type SearchBarProps = {
  value: string;
  onSubmit: (item: string) => void;
  onReset: () => void;
  isSearching: boolean;
  searchQueryType: SearchQueryType;
  onChangeSearchQueryType: (item: SearchQueryType) => void;
};

const SearchBar = ({
  value,
  onSubmit,
  onReset,
  isSearching,
  searchQueryType,
  onChangeSearchQueryType,
}: SearchBarProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const input = formRef.current?.elements.namedItem('keyword') as HTMLInputElement | null;
    if (input) input.value = value ?? '';
  }, [value]);

  const searchQtOptionMap: Record<SearchQueryType, string> = {
    Keyword: '책 제목 또는 저자를 입력하세요',
    Title: '검색할 제목을 입력하세요',
    Author: '검색할 저자를 입력하세요',
    Publisher: '검색할 출판사를 입력하세요',
  };
  return (
    <div className="flex justify-start items-center gap-2">
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const keyword = (formData.get('keyword') as string | null)?.trim() ?? '';
          if (!keyword) {
            toast.warn('검색어를 입력해주세요');
            return;
          }
          onSubmit(keyword);
        }}
        ref={formRef}
        className="flex gap-2 rounded-2xl border border-gray-200 px-2 h-10 box-border"
      >
        <div className="relative shrink-0 flex items-center ">
          <select
            value={searchQueryType}
            onChange={(e) => onChangeSearchQueryType(e.target.value as SearchQueryType)}
            className="h-6 w-auto min-w-0 appearance-none text-[11px] text-gray-700 border-r border-gray-200 pr-4 focus:outline-none text-center bg-white"
          >
            <option value="Keyword">제목or저자</option>
            <option value="Title">제목</option>
            <option value="Author">저자</option>
            <option value="Publisher">출판사</option>
          </select>
          <FiChevronDown
            size={14}
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="search"
            name="keyword"
            autoComplete="off"
            defaultValue={value}
            autoFocus
            maxLength={10}
            placeholder={searchQtOptionMap[searchQueryType]}
            className="flex-1 bg-transparent outline-none text-xs placeholder-gray-400 min-w-48"
          />
          <ButtonComponent
            type="submit"
            variant="primary"
            size="xs"
            isLoading={isSearching}
            loadingText=""
            className="!w-8 !h-8 !min-w-8 !p-0 flex items-center justify-center"
          >
            <FiSearch size={16} />
          </ButtonComponent>
          <ButtonComponent
            className="!w-8 !h-8 !min-w-8 !p-0 flex items-center justify-center"
            type="button"
            label="초기화"
            variant="secondary"
            size="xs"
            onClick={() => {
              onReset();
              formRef.current?.reset();
            }}
          >
            <FiX size={16} />
          </ButtonComponent>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
