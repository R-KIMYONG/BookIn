'use client';
import BookListView from '@/components/common/BookListView';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/ui/Button';
import { useSearchNavigate } from '@/hooks/search/useSearchNavigate';
import { TargetTypes } from '@/shared/constants/category';
import { APP_QUERY_KEYS } from '@/shared/constants/urlParams';
import { MINUTE } from '@/shared/constants/time';
import { BookSummary, Paged } from '@/shared/domain/book/types';
import { searchKeys } from '@/shared/domain/search/queryKeys';
import { SearchOptionType } from '@/shared/domain/search/types';
import getTotalPages from '@/shared/utils/pagination';
import { useQuery } from '@tanstack/react-query';

type SearchResultContainerProps = SearchOptionType & {
  target?: TargetTypes; // URL에 다시 담을 BookIn 값 (없으면 전체 검색)
  page: number;
};

const SearchResultContainer = ({ keyword, target, category, sort, page }: SearchResultContainerProps) => {
  const { setSearchUrl } = useSearchNavigate();

  const {
    data: searchData,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    // 서버(page.tsx)가 같은 키로 미리 넣어둔 결과를 그대로 이어받음
    queryKey: searchKeys.list({ query: keyword, category, sort, page }),
    queryFn: async (): Promise<Paged<BookSummary>> => {
      const params = new URLSearchParams();
      params.set(APP_QUERY_KEYS.searchKeyWord, keyword);
      if (target) params.set(APP_QUERY_KEYS.target, target);
      params.set(APP_QUERY_KEYS.sort, sort);
      params.set(APP_QUERY_KEYS.page, String(page));

      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('검색 결과를 불러오지 못했어요.');
      return res.json();
    },
    staleTime: 5 * MINUTE,
    enabled: !!keyword,
  });

  const totalPages = searchData ? getTotalPages(searchData.totalCount, searchData.pageSize) : 0;

  const errorSlot = (
    <div className="border rounded-xl p-6 my-6">
      <p className="font-semibold">목록을 불러오지 못했어요</p>
      <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
      <div className="mt-4">
        <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
      </div>
    </div>
  );

  const emptySlot = (
    <EmptyState title={`‘${keyword}’ 검색 결과가 없어요`} description="검색어나 검색 옵션을 다시 확인해 주세요." />
  );

  return (
    <div className="px-1 sm:px-6 md:px-10 flex-1">
      <BookListView
        list={searchData?.items ?? []}
        page={page}
        totalPages={totalPages}
        listDataPending={isPending}
        isFetching={isFetching}
        isError={isError}
        errorSlot={errorSlot}
        emptySlot={emptySlot}
        onPageChange={(p) => setSearchUrl({ keyword, target, sort, page: p })}
      />
    </div>
  );
};

export default SearchResultContainer;
