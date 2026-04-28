'use client';

import CategoryItem from './CategoryItem';
import { Book, Item, SearchResult } from '@/types/book.type';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import AppPagination from '../common/AppPagination';
import getTotalPages from '@/utils/pagination';
import { QueryType } from '@/types/useListUrlState.type';
import QueryTypeTabs from '../common/filters/QueryTypeTabs';
import SearchBar from '../common/filters/SearchBar';
import useHomeListUrlState from '@/hooks/url/useHomeListUrlState';
import { SearchQueryType } from '@/types/searchBar.type';
import SkeletonGrid from '../common/SkeletonGrid';
import { useFetchLikes } from '@/hooks/like/useFetchLikes';
import { useMemo } from 'react';
import { useFetchBookmark } from '@/hooks/bookmark/useFetchBookmark';

type PagedResult<T> = {
  items: T[];
  totalResults: number;
  itemsPerPage: number;
};

const emptyPaged = <T,>(itemsPerPage = 20): PagedResult<T> => ({
  items: [],
  totalResults: 0,
  itemsPerPage,
});

const Category = () => {
  const { queryType, page, searchKeyWord, searchQueryType, setHomeUrl } = useHomeListUrlState();
  const isSearching = Boolean(searchKeyWord?.trim());

  const {
    data: listData,
    isPending: bookItemPending,
    isFetching: bookItemFetching,
  } = useQuery<PagedResult<Item>, Error>({
    queryKey: ['books', queryType, page],
    queryFn: async ({ queryKey }) => {
      const [_, qt, p] = queryKey as [string, QueryType, number];
      const url =
        `/api/aladin/list?QueryType=${qt}` + `&page=${p}` + (qt === 'ItemEditorChoice' ? `&CategoryId=170` : '');
      const res = await fetch(url);

      if (!res.ok) throw new Error(`AladinApi ${res.status}`);
      const data: Book = await res.json();
      return {
        items: data.item ?? [],
        totalResults: Number(data.totalResults ?? 0),
        itemsPerPage: Number(data.itemsPerPage ?? 20),
      };
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3, //3분
    enabled: !isSearching,
  });
  const {
    data: searchData,
    isPending: searchPending,
    isFetching: searchFetching,
  } = useQuery<PagedResult<Item>, Error>({
    queryKey: ['search', searchKeyWord, searchQueryType, page],
    queryFn: async ({ queryKey }) => {
      const [_, searchKeyWord, searchQueryType, page] = queryKey as [string, string | null, SearchQueryType, number];
      if (!searchKeyWord?.trim()) return emptyPaged<Item>(20);

      const url = `/api/aladin/search?SearchKeyWord=${encodeURIComponent(searchKeyWord)}&page=${page}&QueryType=${searchQueryType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('검색 실패');
      const data: SearchResult = await res.json();
      return {
        items: data.item ?? [],
        totalResults: Number(data.totalResults ?? 0),
        itemsPerPage: Number(data.itemsPerPage ?? 20),
      };
    },
    staleTime: 1000 * 60, //1분
    enabled: isSearching,
  });
  const searchTotal = searchData?.totalResults ?? 0;

  const makeItemKey = (it: Item, index: number) => {
    const base =
      it.isbn13?.trim() ||
      it.isbn?.trim() ||
      (it.itemId !== null ? String(it.itemId) : '') ||
      it.link ||
      it.title ||
      'no-id';
    return `${base}-${index}`;
  };

  const makeHref = (it: Item): string | undefined => {
    const isbn13 = it.isbn13?.trim();
    const isbn10 = it.isbn?.trim();
    const itemId = it.itemId;

    if (isbn13) return `/${isbn13}?type=isbn13`;
    if (isbn10) return `/${isbn10}?type=isbn`;
    if (itemId != null && String(itemId).trim()) return `/${itemId}?type=itemid`;
    return undefined;
  };

  const isFetching = isSearching ? searchFetching : bookItemFetching;
  //데이터 새로 가져오기 검색중이면 검색의 데이터 다시 가져오기아닐 시 전체 리스트 리패칭
  const isPending = isSearching ? searchPending : bookItemPending;

  const list = useMemo(() => {
    return isSearching ? (searchData?.items ?? []) : (listData?.items ?? []);
  }, [isSearching, searchData?.items, listData?.items]);
  //현재 화면에서 리스트카드의 정보 즉 각각의 카드
  const isbnList = useMemo(() => {
    return list.map((item) => item.isbn13?.trim() || item.isbn?.trim() || '').filter(Boolean);
  }, [list]);

  useFetchLikes(isbnList);
  useFetchBookmark(isbnList);

  const totalResults = isSearching ? (searchData?.totalResults ?? 0) : (listData?.totalResults ?? 0);
  //패칭해온 총결과
  const perPage = isSearching ? (searchData?.itemsPerPage ?? 20) : (listData?.itemsPerPage ?? 20);
  //API 응답의 itemsPerPage(페이지당 개수). 없거나 이상하면 20으로 fallback.

  const totalPages = getTotalPages(totalResults, perPage);

  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-2 overflow-x-hidden">
      <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-start md:justify-between py-4 box-border">
        <div className="md:flex-1 md:pr-3 w-full ">
          <QueryTypeTabs
            value={queryType}
            onChange={(k) => setHomeUrl({ queryType: k, searchKeyWord: null })}
            disable={isSearching}
          />
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <SearchBar
            value={searchKeyWord}
            isSearching={isFetching}
            searchQueryType={searchQueryType}
            onSubmit={(keyword) => setHomeUrl({ searchKeyWord: keyword, page: 1 })}
            onReset={() => setHomeUrl({ searchKeyWord: null, page: 1 })}
            onChangeSearchQueryType={(sq) => setHomeUrl({ searchQueryType: sq, page: 1 })}
          />

          {isSearching && (
            <p className="text-[12px] text-gray-600 text-nowrap md:pr-4 box-border pl-2">
              {searchTotal > 0 ? `검색결과 ${searchTotal}개` : '검색결과가 없습니다.'}
            </p>
          )}
        </div>
      </div>
      {isPending ? (
        <SkeletonGrid count={20} />
      ) : (
        <div className="w-full grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((item, index) => {
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
      )}
      {/* 페이지 네이션 */}
      <div className="mt-6 flex justify-center">
        <AppPagination
          totalPages={totalPages}
          page={page}
          disabled={isFetching}
          onChange={(p) => setHomeUrl({ page: p })}
        />
      </div>
    </section>
  );
};
export default Category;
