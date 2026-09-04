import { DropdownItem } from '@/components/common/ui/Dropdown/types';

import { SearchQueryType } from '@/shared/domain/search/types';

export const SEARCH_TYPE_LABEL: Record<SearchQueryType, string> = {
  Keyword: '제목or저자',
  Title: '제목',
  Author: '저자',
  Publisher: '출판사',
};

export const SEARCH_TYPE_ITEMS: DropdownItem<SearchQueryType>[] = [
  {
    type: 'action',
    label: SEARCH_TYPE_LABEL.Keyword,
    value: 'Keyword',
  },
  {
    type: 'action',
    label: SEARCH_TYPE_LABEL.Title,
    value: 'Title',
  },
  {
    type: 'action',
    label: SEARCH_TYPE_LABEL.Author,
    value: 'Author',
  },
  {
    type: 'action',
    label: SEARCH_TYPE_LABEL.Publisher,
    value: 'Publisher',
  },
];

export const SEARCH_QT_LIST = ['Keyword', 'Title', 'Author', 'Publisher'] as const;

export const DEFAULT_SEARCH_QT = 'Keyword';

export const SEARCH_QUERYTYPE_OPTION: Record<SearchQueryType, string> = {
  Keyword: '책 제목 또는 저자를 입력하세요',
  Title: '검색할 제목을 입력하세요',
  Author: '검색할 저자를 입력하세요',
  Publisher: '검색할 출판사를 입력하세요',
};

export const SEARCH_MAX_RESULTS = 50;

export const RANGE = [
  { v: 'Book' as const, label: '국내' },
  { v: 'Foreign' as const, label: '외국' },
  { v: 'eBook' as const, label: 'eBook' },
];
