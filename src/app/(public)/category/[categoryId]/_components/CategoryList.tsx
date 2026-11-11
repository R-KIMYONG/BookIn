'use client';

import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';
import BookListView from '@/components/common/BookListView';
import { CategoryId } from '@/shared/domain/book/ids';
import { Yes24ListType } from '@/shared/lib/yes24/types';
import ListTypeTabs from '@/components/common/ui/ListTypeTabs';
import { CATEGORY_LIST_SIZE } from '@/shared/lib/yes24/constants';
import { useBookList } from '@/hooks/book/useBookList';
import { useMemo } from 'react';
import useUrlParams from '@/hooks/url/useUrlParams';
import EmptyState from '@/components/common/EmptyState';
import getTotalPages from '@/shared/utils/pagination';

type CategoryListProps = {
  categoryId: CategoryId;
  tabs: Yes24ListType[];
  listType: Yes24ListType;
  page: number;
};
const CategoryList = ({ categoryId, tabs, listType, page }: CategoryListProps) => {
  const router = useRouter();
  const { setParams } = useUrlParams();
  const { data, isPending, error, isFetching, isError, refetch } = useBookList({
    listType,
    categoryId,
    page,
    pageSize: CATEGORY_LIST_SIZE,
  });

  const totalPages = data ? getTotalPages(data.totalCount, data.pageSize) : 0;

  const errorSlot = (
    <div className="border rounded-xl p-6 mt-10">
      <p className="font-semibold">문제가 발생했어요</p>
      <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="secondary" label="홈으로" onClick={() => router.push('/')} />
        <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
      </div>
    </div>
  );

  const emptySlot = (
    <EmptyState
      title="이 탭에는 표시할 책이 없어요"
      description="위의 다른 탭(신간 등)을 선택하거나 다른 분류로 이동해 보세요."
      showButton={false}
    />
  );

  return (
    <>
      <ListTypeTabs
        tabs={tabs}
        active={listType}
        onChange={(tab) => setParams({ type: tab === tabs[0] ? null : tab, page: null })}
      />
      <BookListView
        list={data?.items ?? []}
        page={page}
        totalPages={totalPages}
        listDataPending={isPending}
        isFetching={isFetching}
        isError={isError}
        errorSlot={errorSlot}
        emptySlot={emptySlot}
        onPageChange={(p) => setParams({ page: p === 1 ? null : p })}
      />
    </>
  );
};

export default CategoryList;
