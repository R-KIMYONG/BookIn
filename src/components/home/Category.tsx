'use client';
import QueryTypeTabs from '../common/filters/QueryTypeTabs';
import { TargetTypes } from '@/shared/constants/category';
import { useBookListData } from '@/hooks/book/useBookListData';
import Button from '../common/ui/Button';
import EmptyState from '../common/EmptyState';
import BookListView from '../common/BookListView';

type CategoryProps = {
  target: TargetTypes;
};

const Category = ({ target }: CategoryProps) => {
  const {
    list,
    page,
    queryType,
    listDataPending,
    totalPages,
    isFetching,
    isError,
    error,
    refetch,
    searchTotal,
    searchKeyWord,
    searchQueryType,
    setListUrl,
  } = useBookListData({ target });
  const isSearching = Boolean(searchKeyWord?.trim());

  const errorSlot = (
    <div className="border rounded-xl p-6 my-6">
      <p className="font-semibold">목록을 불러오지 못했어요</p>
      <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
      <div className="mt-4">
        <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
      </div>
    </div>
  );

  const emptySlot = isSearching ? (
    <EmptyState
      title={`‘${searchKeyWord}’ 검색 결과가 없어요`}
      description="검색어나 검색 옵션을 다시 확인해 주세요."
    />
  ) : (
    <EmptyState title="표시할 책이 없어요" description="다른 탭(베스트셀러/신간 등)을 선택해 보세요." />
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-2 overflow-x-hidden">
      <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-start md:justify-between py-4 box-border">
        <div className="md:flex-1 md:pr-3 w-full ">
          <QueryTypeTabs
            value={queryType}
            onChange={(k) => setListUrl({ queryType: k, searchKeyWord: null }, { shallow: true })}
            disable={isSearching}
          />
        </div>
      </div>
      <BookListView
        list={list}
        page={page}
        totalPages={totalPages}
        listDataPending={listDataPending}
        isFetching={isFetching}
        isError={isError}
        errorSlot={errorSlot}
        emptySlot={emptySlot}
        onPageChange={(p) => setListUrl({ page: p }, { shallow: true })}
      />
    </section>
  );
};
export default Category;
