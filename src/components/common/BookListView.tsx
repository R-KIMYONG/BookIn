'use client';

import { useEffect, useMemo, useState } from 'react';
import AppPagination from '@/components/common/AppPagination';
import CategoryItem from '@/components/home/CategoryItem';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import Yes24Attribution from '@/components/common/Yes24Attribution';
import { useBookStats } from '@/hooks/book/useBookStats';
import { useMyStatus } from '@/hooks/book/useMyStatus';
import { BookSummary } from '@/shared/domain/book/types';
import BookLink from '../book/BookLink';

type BookListViewProps = {
  list: BookSummary[];
  page: number;
  totalPages: number;
  listDataPending: boolean;
  isFetching: boolean;
  isError?: boolean;
  errorSlot?: React.ReactNode;
  emptySlot?: React.ReactNode;
  onPageChange: (page: number) => void;
};

const BookListView = ({
  list,
  page,
  totalPages,
  listDataPending,
  isFetching,
  isError,
  errorSlot,
  emptySlot,
  onPageChange,
}: BookListViewProps) => {
  const itemIds = useMemo(() => list.map((book) => book.itemId), [list]);
  const { data: stats } = useBookStats(itemIds);
  useMyStatus(itemIds);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dim = mounted && isFetching;

  // 에러는 전체 대체
  if (isError && errorSlot) return <>{errorSlot}</>;

  // 빈 결과(로딩 아님)도 전체 대체
  const isEmpty = !listDataPending && list.length === 0;
  if (isEmpty) return <>{emptySlot ?? null}</>;

  return (
    <>
      {listDataPending ? (
        <SkeletonGrid count={20} />
      ) : (
        <div
          className={`w-full grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${dim ? 'opacity-60 ' : ''}transition-opacity`}
        >
          {list.map((book) => (
            <BookLink key={book.itemId} itemId={book.itemId} adult={book.adult}>
              <CategoryItem
                item={book}
                viewCount={stats?.[book.itemId]?.view_count ?? 0}
                commentCount={stats?.[book.itemId]?.comment_count ?? 0}
              />
            </BookLink>
          ))}
        </div>
      )}

      {/* 페이지네이션은 스켈레톤 중에도 항상 유지 */}
      <div className="mt-6 flex justify-center min-h-[2rem]">
        {mounted && (
          <AppPagination totalPages={totalPages} page={page} isFetching={isFetching} onChange={onPageChange} />
        )}
      </div>
      <Yes24Attribution />
    </>
  );
};

export default BookListView;
