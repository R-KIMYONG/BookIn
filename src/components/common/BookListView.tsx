'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppPagination from '@/components/common/AppPagination';
import CategoryItem from '@/components/home/CategoryItem';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import { useBookStats } from '@/hooks/book/useBookStats';
import { makeHref } from '@/shared/domain/book/makeHref';
import { makeItemKey } from '@/shared/domain/book/makeItemKey';
import { getBookKey } from '@/shared/domain/book/getBookKey';
import { AladinBookInfo } from '@/shared/types/api';
import { useMyStatus } from '@/hooks/book/useMyStatus';

type BookListViewProps = {
  list: AladinBookInfo[];
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
  const isbnList = useMemo(() => list.map((b) => b.isbn13).filter(Boolean), [list]);
  const { data: stats } = useBookStats(isbnList);
  useMyStatus(isbnList);
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
          {list.map((book, index) => {
            const href = makeHref(book);
            const key = makeItemKey(book, index);
            const bookKey = getBookKey(book);
            return href ? (
              <Link href={href} key={key}>
                <CategoryItem
                  item={book}
                  viewCount={bookKey ? (stats?.[bookKey]?.view_count ?? 0) : 0}
                  commentCount={bookKey ? (stats?.[bookKey]?.comment_count ?? 0) : 0}
                />
              </Link>
            ) : (
              <div key={key} className="opacity-60 cursor-not-allowed" title="상세 페이지가 없어서 이동할 수 없어요">
                <CategoryItem
                  item={book}
                  disabled
                  viewCount={bookKey ? (stats?.[bookKey]?.view_count ?? 0) : 0}
                  commentCount={bookKey ? (stats?.[bookKey]?.comment_count ?? 0) : 0}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 페이지네이션은 스켈레톤 중에도 항상 유지 */}
      <div className="mt-6 flex justify-center">
        <AppPagination totalPages={totalPages} page={page} isFetching={isFetching} onChange={onPageChange} />
      </div>
    </>
  );
};

export default BookListView;
