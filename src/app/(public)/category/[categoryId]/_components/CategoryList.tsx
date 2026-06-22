'use client';

import EmptyState from '@/components/common/EmptyState';
import { TargetTypes } from '@/shared/constants/category';
import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { Genre } from '@/shared/domain/category/types';
import { useBookListData } from '@/hooks/book/useBookListData';
import { PagedResult, QueryType } from '@/shared/domain/aladin/types';
import { AladinBookInfo } from '@/shared/types/api';
import BookListView from '@/components/common/BookListView';

type CategoryListProps = {
  categoryId: number;
  target: TargetTypes;
  initialQueryType: QueryType;
  initialPage: number;
  initialList: PagedResult<AladinBookInfo>;
  genreData: Genre[];
};

const CategoryList = ({
  categoryId,
  target,
  initialQueryType,
  initialPage,
  genreData,
  initialList,
}: CategoryListProps) => {
  const router = useRouter();
  const {
    page,
    list,
    listDataPending,
    totalPages,
    isFetching,
    isError,
    error,
    isSearching,
    searchKeyWord,
    refetch,
    setListUrl,
  } = useBookListData({ target, categoryId, initialQueryType, initialPage, initialList });

  const errorSlot = (
    <section className="max-w-7xl m-auto mt-10 px-10">
      <div className="border rounded-xl p-6">
        <p className="font-semibold">문제가 발생했어요</p>
        <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="secondary" label="홈으로" onClick={() => router.push('/')} />
          <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
        </div>
      </div>
    </section>
  );

  const targetLabel = HEADER_GROUPS.find((g) => g.key === target)?.label ?? '전체';
  const categoryLabel = genreData.find((g) => g.id === categoryId)?.label ?? '전체';

  const emptySlot = isSearching ? (
    <EmptyState
      title={`‘${targetLabel} > ${categoryLabel}’에서 ‘${searchKeyWord}’ 검색 결과가 없어요`}
      description="대분류·소분류를 바꾸거나 검색어를 다시 확인해 주세요."
    />
  ) : (
    <EmptyState
      title="이 카테고리에는 표시할 책이 없어요"
      description="다른 소분류로 이동하거나, 상단 탭(베스트셀러/신간 등)을 바꿔보세요."
      href="/"
      buttonLabel="홈으로"
    />
  );

  return (
    <BookListView
      list={list}
      page={page}
      totalPages={totalPages}
      listDataPending={listDataPending}
      isFetching={isFetching}
      isError={isError}
      errorSlot={errorSlot}
      emptySlot={emptySlot}
      onPageChange={(p) => setListUrl({ page: p }, { scroll: false, shallow: true })}
    />
  );
};

export default CategoryList;
