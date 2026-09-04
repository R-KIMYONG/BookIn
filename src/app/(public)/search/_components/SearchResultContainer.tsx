'use client';
import BookListView from '@/components/common/BookListView';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/ui/Button';
import { useSearchNavigate } from '@/hooks/search/useSearchNavigate';
import { MINUTE } from '@/shared/constants/time';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { SearchOptionType } from '@/shared/domain/search/types';
import getTotalPages from '@/shared/utils/pagination';
import { useQuery } from '@tanstack/react-query';

const SearchResultContainer = ({
  keyword,
  target,
  searchQueryType,
  categoryId,
  page,
}: SearchOptionType & { page: number }) => {
  const { setSearchUrl } = useSearchNavigate();
  const {
    data: searchData,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: aladinKeys.search({ searchKeyWord: keyword, searchQueryType, page, target, categoryId }),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('q', keyword);
      params.set('target', target);
      params.set('sq', searchQueryType);
      params.set('ci', String(categoryId));
      params.set('page', String(page));
      const res = await fetch(`/api/aladin/search?${params}`);
      if (!res.ok) throw Error('검색 fail');

      const data = await res.json();
      return data;
    },
    staleTime: 5 * MINUTE,
    enabled: !!keyword,
  });
  const searchResultTotalPage = searchData ? getTotalPages(searchData.totalResults, searchData.itemsPerPage) : 0;

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
        list={searchData.items ?? []}
        page={page}
        totalPages={searchResultTotalPage}
        listDataPending={isPending}
        isFetching={isFetching}
        isError={isError}
        errorSlot={errorSlot}
        emptySlot={emptySlot}
        onPageChange={(p) => setSearchUrl({ keyword, sq: searchQueryType, target, ci: categoryId, page: p })}
      />
    </div>
  );
};

export default SearchResultContainer;
