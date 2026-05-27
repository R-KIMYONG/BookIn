'use client';

import { useMemo, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import useCategoryUrlState from '@/hooks/url/useCategoryUrlState';
import AppPagination from '@/components/common/AppPagination';
import CategoryItem from '@/components/home/CategoryItem';
import EmptyState from '@/components/common/EmptyState';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';
import { MINUTE } from '@/shared/constants/time';
import { aladinKeys } from '@/shared/domain/aladin/queryKeys';
import { fetchAladinList } from '@/shared/lib/aladin/fetchAladinList.client';
import { makeHref } from '@/shared/domain/book/makeHref';
import { makeItemKey } from '@/shared/domain/book/makeItemKey';
import { QueryType } from '@/shared/domain/aladin/constants';
import { TargetTypes } from '@/shared/constants/category';
import Button from '@/components/common/ui/Button';
import { useRouter } from 'next/navigation';

type CategoryListProps = {
  categoryId: number;
  queryType: QueryType;
  target: TargetTypes;
  page: number;
};

const CategoryList = ({ categoryId, queryType, target, page }: CategoryListProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setCategoryUrl } = useCategoryUrlState({ categoryId, defaultTarget: target });

  const { data, isError, error } = useQuery({
    queryKey: aladinKeys.list({ queryType, page, target, categoryId }),
    queryFn: () => fetchAladinList({ queryType, page, target, categoryId }),
    staleTime: 3 * MINUTE,
  });

  const { data: lastPageData } = useQuery({
    queryKey: aladinKeys.lastPage({ queryType, target, categoryId }),
    queryFn: async () => {
      const params = new URLSearchParams({ QueryType: queryType, target, CategoryId: String(categoryId) });
      const res = await fetch(`/api/aladin/last-page?${params.toString()}`);
      if (!res.ok) throw new Error('lastPage 실패');
      return res.json() as Promise<{ lastPage: number }>;
    },
    staleTime: 10 * MINUTE,
  });
  const totalPages = lastPageData?.lastPage ?? 1;
  const isEmpty = (data?.items?.length ?? 0) === 0 || totalPages === 0;

  const isbnList = useMemo(() => (data?.items ?? []).map((item) => item.isbn13), [data?.items]);
  useFetchLikeCount(isbnList);
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
              onClick={() => setCategoryUrl({ page: 1 }, { replace: true, scroll: false })}
            />
          </div>
        </div>
      </section>
    );
  }

  if (isEmpty) {
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
        {data?.items.map((item, index) => {
          const href = makeHref(item);
          const key = makeItemKey(item, index);

          return href ? (
            <Link href={href} key={key}>
              <CategoryItem item={item} />
            </Link>
          ) : (
            <div key={key} className="opacity-60 cursor-not-allowed" title="상세 페이지가 없어서 이동할 수 없어요">
              <CategoryItem item={item} disabled={true} />
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
              setCategoryUrl({ page: p }, { scroll: false });
            });
          }}
        />
      </div>
    </>
  );
};

export default CategoryList;
