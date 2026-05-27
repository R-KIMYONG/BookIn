import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import { SearchQueryType } from '@/shared/constants/search';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { ChevronDown, Search, X } from 'lucide-react';
import Dropdown from '../ui/Dropdown';
import { SEARCH_TYPE_ITEMS, SEARCH_TYPE_LABEL } from '@/shared/domain/search/contants';

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
  const [keyword, setKeyword] = useState(value);
  useEffect(() => {
    const input = formRef.current?.elements.namedItem('keyword') as HTMLInputElement | null;
    if (input) input.value = value ?? '';
  }, [value]);
  useEffect(() => {
    setKeyword(value);
  }, [value]);

  const searchQtOptionMap: Record<SearchQueryType, string> = {
    Keyword: '책 제목 또는 저자를 입력하세요',
    Title: '검색할 제목을 입력하세요',
    Author: '검색할 저자를 입력하세요',
    Publisher: '검색할 출판사를 입력하세요',
  };
  const currentLabel = SEARCH_TYPE_LABEL[searchQueryType];
  return (
    <div className="w-full flex justify-start items-center gap-2">
      <form
        onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const keyword = (formData.get('keyword') as string | null)?.trim() ?? '';
          if (!keyword) {
            showToast(RESULT_CODE.VALIDATION_REQUIRED_SEARCHKEYWORD);
            return;
          }
          onSubmit(keyword);
        }}
        ref={formRef}
        className="flex w-full gap-1 rounded-2xl border border-gray-200 px-1 h-10"
      >
        <div className="relative shrink-0 flex items-center border-r border-gray-200 ">
          <Dropdown
            align="left"
            variant="ghost"
            trigger={
              <div className="flex items-center gap-1 text-[11px] text-gray-700">
                <span>{currentLabel}</span>

                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
            }
            items={SEARCH_TYPE_ITEMS}
            onSelect={(value) => onChangeSearchQueryType(value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="search"
            name="keyword"
            autoComplete="off"
            value={keyword}
            maxLength={10}
            placeholder={searchQtOptionMap[searchQueryType]}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs placeholder-gray-400 min-w-0 pl-2"
          />
          <Button type="submit" variant="primary" size="xs" isLoading={isSearching} loadingText="">
            <Search className="w-4 h-4 " />
          </Button>
          <Button
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
            <X className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
