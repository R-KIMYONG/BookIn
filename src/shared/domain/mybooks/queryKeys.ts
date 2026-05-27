import { MyBooksTabType } from '../mypage/tab';
import { MyBooksFilter } from './filter';
import { SearchField } from './search';
import { MyBooksSort } from './sort';

export const myBooksKeys = {
  all: ['myBooks'] as const,
  list: (params: {
    tab: MyBooksTabType;
    page: number;
    sort: MyBooksSort;
    filter?: MyBooksFilter;
    search?: string;
    searchField?: SearchField;
    tagId?: string;
  }) => ['myBooks', params] as const,
};
