'use client';

import { useMemo, useTransition } from 'react';
import Link from 'next/link';
import AppPagination from '@/components/common/AppPagination';
import CategoryItem from '@/components/home/CategoryItem';
import EmptyState from '@/components/common/EmptyState';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';
import { makeHref } from '@/shared/domain/book/makeHref';
import { makeItemKey } from '@/shared/domain/book/makeItemKey';
import { TargetTypes } from '@/shared/constants/category';
import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { Genre } from '@/shared/domain/category/types';
import { useBookListData } from '@/hooks/book/useBookListData';
import { useBookStats } from '@/hooks/book/useBookStats';
import { getBookKey } from '@/shared/domain/book/getBookKey';

type CategoryListProps = {
  categoryId: number;
  target: TargetTypes;
  page: number;
  genreData: Genre[];
};

const CategoryList = ({ categoryId, target, page, genreData }: CategoryListProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { list, listDataPending, totalPages, isError, error, isSearching, searchKeyWord, setListUrl } = useBookListData(
    { target, page, categoryId }
  );

  const isbnList = useMemo(() => list.map((item) => item.isbn13).filter(Boolean), [list]);
  useFetchLikeCount(isbnList);

  const { data: stats } = useBookStats(isbnList);

  if (isError) {
    return (
      <section className="max-w-7xl m-auto mt-10 px-10">
        <div className="border rounded-xl p-6">
          <p className="font-semibold">문제가 발생했어요</p>
          <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="secondary" label="홈으로" onClick={() => router.push('/')} />
            <Button
              size="sm"
              variant="primary"
              label="현재 페이지 1로"
              onClick={() => setListUrl({ page: 1 }, { replace: true, scroll: false })}
            />
          </div>
        </div>
      </section>
    );
  }

  if (listDataPending) {
    return <SkeletonGrid count={20} />;
  }

  if (list.length === 0) {
    if (isSearching) {
      const targetLabel = HEADER_GROUPS.find((g) => g.key === target)?.label ?? '전체';
      const categoryLabel = genreData.find((g) => g.id === categoryId)?.label ?? '전체';
      return (
        <EmptyState
          title={`‘${targetLabel} > ${categoryLabel}’에서 ‘${searchKeyWord}’ 검색 결과가 없어요`}
          description="대분류·소분류를 바꾸거나 검색어를 다시 확인해 주세요."
        />
      );
    }
    return (
      <EmptyState
        title="이 카테고리에는 표시할 책이 없어요"
        description="다른 소분류로 이동하거나, 상단 탭(베스트셀러/신간 등)을 바꿔보세요."
        href="/"
        buttonLabel="홈으로"
      />
    );
  }

  return (
    <>
      <div
        className={`w-full grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isPending ? 'opacity-60 ' : ''} transition-opacity`}
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
                disabled={true}
                viewCount={bookKey ? (stats?.[bookKey]?.view_count ?? 0) : 0}
                commentCount={bookKey ? (stats?.[bookKey]?.comment_count ?? 0) : 0}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <AppPagination
          totalPages={totalPages === 0 ? 1 : totalPages}
          page={page}
          disabled={isPending}
          onChange={(p) => {
            startTransition(() => {
              setListUrl({ page: p }, { scroll: false });
            });
          }}
        />
      </div>
    </>
  );
};

export default CategoryList;
