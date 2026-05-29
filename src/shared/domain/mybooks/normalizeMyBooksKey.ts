import { MyBooksTabType } from '../mypage/tab';
import { TAG_DEFAULT } from '../tag/constants';
import { MyBooksFilter } from './filter';
import { SearchField } from './search';
import { MyBooksSort } from './sort';

type MyBooksKeyParams = {
  tab: MyBooksTabType;
  page: number;
  sort: MyBooksSort;
  filter?: MyBooksFilter;
  search?: string;
  searchField?: SearchField;
  tagId?: string;
};

export const normalizeMyBooksKey = (params: MyBooksKeyParams): MyBooksKeyParams => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== TAG_DEFAULT)
  ) as MyBooksKeyParams;
};
