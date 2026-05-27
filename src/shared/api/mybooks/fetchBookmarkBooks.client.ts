import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort } from '@/shared/domain/mybooks/sort';

type fetchBookmarkBooksProps = {
  page: number;
  pageSize: number;
  sort: MyBooksSort;
  memoFilter?: MyBooksFilter;
  search?: string | null;
  searchField?: SearchField | null;
  tagId?: string | null;
};

export const fetchBookmarkBooks = async ({
  page,
  pageSize,
  sort,
  memoFilter = FILTER_DEFAULT,
  search,
  searchField,
  tagId,
}: fetchBookmarkBooksProps) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
    memoFilter,
  });

  if (search) {
    params.set('search', search);
  }

  if (searchField) {
    params.set('searchField', searchField);
  }

  if (tagId) {
    params.set('tagId', tagId);
  }

  const res = await fetch(`/api/mybooks/bookmarks?${params.toString()}`);

  if (!res.ok) {
    throw new Error('댓글 도서 조회 실패');
  }

  return res.json();
};
