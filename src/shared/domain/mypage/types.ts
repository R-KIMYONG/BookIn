import { MyBooksFilter } from '../mybooks/filter';
import { SearchField } from '../mybooks/search';
import { MyBooksSort } from '../mybooks/sort';
import { MypageSectionType } from './section';
import { MyBooksTabType } from './tab';

export type MypageProps = {
  page: number;
  sort: MyBooksSort;
  search: string;
  tab: MyBooksTabType;
  memoFilter: MyBooksFilter;
  searchField?: SearchField;
  tagId: string;
  section: MypageSectionType;
};
