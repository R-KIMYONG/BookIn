'use client';
import useCategoryUrlState from '@/hooks/url/useCategoryUrlState';
import { Book } from '@/types/book.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import InvalidCategory from './InvalidCategory';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import AppPagination from '@/components/common/AppPagination';
import CategoryItem from '@/components/home/CategoryItem';
import Link from 'next/link';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import EmptyState from '@/components/common/EmptyState';
import QueryTypeTabs from '@/components/common/filters/QueryTypeTabs';
import { useRouter } from 'next/navigation';
import { CategoryPageProps } from '@/types/categoryPage.type';
import { useFetchLikes } from '@/hooks/useFetchLikes';

const CategoryClient = ({ params, koreanGenres, foreignGenres, ebookGenres }: CategoryPageProps) => {
  const categoryIdNum = Number(params.categoryId);
  const router = useRouter();
  const isValidNum = Number.isFinite(categoryIdNum) && categoryIdNum > 0; //[방어코드] URL에 입력된 categoryNum이 진짜 숫자인지 0보다 큰지를 체크

  const { isValidCategory, groupLabel, genreData, defaultTarget } = useMemo(() => {
    const kr = koreanGenres ?? [];
    const fr = foreignGenres ?? [];
    const eb = ebookGenres ?? [];

    if (!isValidNum) {
      return { isValidCategory: false, groupLabel: '', genreData: [], defaultTarget: 'Book' as const };
    }

    const inKr = kr.some((g) => g.id === categoryIdNum);
    const inFr = fr.some((g) => g.id === categoryIdNum);
    const inEb = eb.some((g) => g.id === categoryIdNum);

    if (!inKr && !inFr && !inEb) {
      return { isValidCategory: false, groupLabel: '', genreData: [], defaultTarget: 'Book' as const };
    }

    if (inKr) return { isValidCategory: true, groupLabel: '국내도서', genreData: kr, defaultTarget: 'Book' as const };
    if (inFr)
      return { isValidCategory: true, groupLabel: '외국도서', genreData: fr, defaultTarget: 'Foreign' as const };
    return { isValidCategory: true, groupLabel: 'eBook', genreData: eb, defaultTarget: 'eBook' as const };
  }, [koreanGenres, foreignGenres, ebookGenres, categoryIdNum, isValidNum]);
  const { page, queryType, target, setCategoryUrl } = useCategoryUrlState({
    categoryId: categoryIdNum,
    defaultTarget: defaultTarget,
  });

  const { data, isPending, isError, error } = useQuery<Book, Error>({
    queryKey: ['books', categoryIdNum, page, target, queryType],
    queryFn: async ({ queryKey }) => {
      const [_, tab, p, target, qt] = queryKey as [string, number, number, string, string];
      const res = await fetch(`/api/aladin/list?QueryType=${qt}&CategoryId=${tab}&page=${p}&target=${target}`);

      const body = await res.json().catch(() => null);

      if (!res.ok) throw new Error(`카테고리 목록 fetch 실패 (${res.status})`);
      return body as Book;
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled: isValidCategory,
  });
  const { data: lastPageData } = useQuery({
    //외국도서탭, ebook탭으로 API 요청 시 가짜 totalResults수신된 부분 확인되여 진짜 마지막페이지를 이진탐색+이분탐색으로 찾음
    queryKey: ['lastPage', categoryIdNum, target, queryType],
    queryFn: async () => {
      const res = await fetch(
        `/api/aladin/last-page?QueryType=${queryType}&target=${target}&CategoryId=${categoryIdNum}`
      );
      if (!res.ok) throw new Error('lastPage 실패');
      return res.json() as Promise<{ lastPage: number }>;
    },
    staleTime: 1000 * 60 * 10,
    enabled: isValidCategory,
  });

  const totalPages = lastPageData?.lastPage ?? 1;

  const isEmpty = !isPending && !isError && ((data?.item?.length ?? 0) === 0 || totalPages === 0);

  const handleTabClick = (id: number) => {
    router.push(`/category/${id}?target=${target}&page=1&qt=${queryType}`, {
      scroll: false,
    });
  };
  const isbnList = (data?.item ?? []).map((item) => item.isbn13);

  useFetchLikes(isbnList);

  if (!isValidCategory) {
    return <InvalidCategory />;
  }

  if (isError) {
    return (
      <section className="max-w-7xl m-auto mt-10 px-10">
        <div className="border rounded-xl p-6">
          <p className="font-semibold">문제가 발생했어요</p>
          <p className="text-sm text-gray-600 mt-2">{error?.message ?? '알 수 없는 오류'}</p>
          <div className="mt-4 flex gap-2">
            <ButtonComponent size="sm" variant="secondary" label="홈으로" onClick={() => router.push('/')} />
            <ButtonComponent
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
  return (
    <section className="max-w-7xl m-auto mt-6 flex flex-col px-10 gap-4">
      <p className="font-bold border-b text-center pb-3">{groupLabel}</p>

      <div className="md:flex-1 md:pr-3">
        <QueryTypeTabs
          value={queryType}
          onChange={(k) => setCategoryUrl({ queryType: k, searchKeyWord: null, page: 1 })}
          target={target}
        />
      </div>

      <nav
        role="tablist"
        className="border rounded-lg px-3 w-fit h-fit py-3 flex gap-2 box-border flex-row items-start"
      >
        <ul className="flex gap-2 w-fit flex-wrap">
          {genreData.map((tab, index) => {
            const active = tab.id === categoryIdNum;

            return (
              <ButtonComponent
                key={`${tab.id}-${tab.label}-${index}`}
                size="xs"
                variant={active ? 'primary' : 'secondary'}
                label={tab.label}
                onClick={() => handleTabClick(tab.id)}
                loadingText="요청중..."
              />
            );
          })}
        </ul>
      </nav>

      <div className="w-full flex-1">
        {isPending ? (
          <SkeletonGrid count={20} />
        ) : isEmpty ? (
          <EmptyState
            title="이 카테고리에는 표시할 책이 없어요"
            description="다른 소분류로 이동하거나, 상단 탭(베스트셀러/신간 등)을 바꿔보세요."
            href="/"
            buttonLabel="홈으로"
          />
        ) : (
          <div className="grid grid-flow-row auto-rows-auto grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {data?.item.map((item, index) => {
              const key = `${item.isbn13 ?? 'no-isbn'}-${item.itemId ?? 'no-id'}-${index}`;

              return (
                <Link key={key} href={`/${item.isbn13}?type=isbn13`}>
                  <CategoryItem item={item} />
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <AppPagination
            totalPages={totalPages === 0 ? 1 : totalPages}
            page={page}
            onChange={(p) => {
              setCategoryUrl({ page: p });
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default CategoryClient;
