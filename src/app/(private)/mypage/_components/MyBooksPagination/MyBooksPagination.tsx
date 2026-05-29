'use client';
import AppPagination from '@/components/common/AppPagination';
import { useMyBooks } from '@/hooks/mybooks/useMyBooks';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';

const MyBooksPagination = () => {
  const { query, setQuery } = useMypageQueryState();
  const { tab, page, sort, filter, search, searchField, tagId } = query;
  const { result } = useMyBooks(tab, page, sort, filter, search, searchField, tagId);

  const totalPages = Math.max(1, Math.ceil((result?.total ?? 0) / DEFAULT_PAGE_SIZE));

  return (
    <div className="mt-6 flex justify-center">
      <AppPagination page={page} onChange={(p) => setQuery({ page: p })} totalPages={totalPages} />
    </div>
  );
};

export default MyBooksPagination;
