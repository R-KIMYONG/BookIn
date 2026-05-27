import { DropdownItem } from '@/components/common/ui/Dropdown/types';

import { SearchQueryType } from '@/shared/constants/search';

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
