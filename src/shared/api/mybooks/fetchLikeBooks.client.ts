import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort } from '@/shared/domain/mybooks/sort';

type FetchCommentBooksProps = {
  page: number;
  pageSize: number;
  sort: MyBooksSort;
  search?: string | null;
  searchField?: SearchField | null;
};

export const fetchLikeBooks = async ({ page, pageSize, sort, search, searchField }: FetchCommentBooksProps) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sort,
  });

  if (search) {
    params.set('search', search);
  }

  if (searchField) {
    params.set('searchField', searchField);
  }

  const res = await fetch(`/api/mybooks/likes?${params.toString()}`);

  if (!res.ok) {
    throw new Error('댓글 도서 조회 실패');
  }

  return res.json();
};
