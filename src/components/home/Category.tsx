'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  Pagination,
} from '@nextui-org/react';
import CategoryItem from './CategoryItem';
import { Book, Item, SearchResult } from '@/types/book.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import SkeletonItem from './SkeletonItem';
import Link from 'next/link';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
type QueryType = 'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' | 'ItemEditorChoice';

export default function Category() {
  const [queryType, setQueryType] = useState<QueryType>('Bestseller');
  const [page, setPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>('');
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchKeyWord, setSearchKeyWord] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const ALADIN_MAX_PAGES = 50;
  const { data: bookItem, isPending } = useQuery<Book, Error>({
    queryKey: ['books', queryType, page, categoryId],
    queryFn: async ({ queryKey }) => {
      const [_, qt, p, cat] = queryKey as [string, QueryType, number, string];

      const url =
        `/api/AladinApi?QueryType=${qt}` +
        `&page=${p}` +
        (qt === 'ItemEditorChoice' && cat ? `&CategoryId=${encodeURIComponent(cat)}` : '');
      const res = await fetch(url, { cache: 'no-store' });

      if (!res.ok) throw new Error(`AladinApi ${res.status}`);
      return await res.json();
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: keepPreviousData,
  });

  const { data: searchData, isPending: searchPending } = useQuery<SearchResult>({
    queryKey: ['search', searchKeyWord, searchPage],
    queryFn: async ({ queryKey }) => {
      const [_, searchKeyWord, searchPage] = queryKey as [string, string, number];

      if (!searchKeyWord?.trim()) return { item: [], totalResults: 0 };
      const res = await fetch(
        `/api/SearchAladin?SearchKeyWord=${encodeURIComponent(searchKeyWord)}&page=${searchPage}`
      );
      if (!res.ok) throw new Error('검색 실패');
      const searchResult = await res.json();
      return searchResult;
    },
    staleTime: 30000,
    enabled: !!searchKeyWord?.trim(),
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

  const makeHref = (it: Item) => {
    const isbn13 = it.isbn13?.trim();
    const isbn10 = it.isbn?.trim();
    const itemId = it.itemId;

    if (isbn13) return `/${isbn13}?type=isbn13`;
    if (isbn10) return `/${isbn10}?type=isbn`;
    if (itemId != null && String(itemId).trim()) return `/${itemId}?type=itemid`;
    return '#';
  };

  const tabs: { key: QueryType; label: string }[] = [
    { key: 'Bestseller', label: '베스트셀러' },
    { key: 'ItemNewAll', label: '새로 나온 책' },
    { key: 'ItemNewSpecial', label: '화제의 책' },
    { key: 'BlogBest', label: '베스트 예감' },
    { key: 'ItemEditorChoice', label: '편집자 추천' },
  ];
  const activeTabLabel = tabs.find((t) => t.key === queryType)?.label ?? '카테고리';

  const isSearching = !!searchKeyWord?.trim();
  const list = isSearching ? searchData?.item ?? [] : bookItem?.item ?? [];
  const totalResults = isSearching ? Number(searchData?.totalResults ?? 0) : Number(bookItem?.totalResults ?? 0);

  const perPage = isSearching ? Number((searchData as any)?.itemsPerPage ?? 20) : Number(bookItem?.itemsPerPage ?? 20);

  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20;
  const safeTotalResults = Number.isFinite(totalResults) && totalResults > 0 ? totalResults : 0;

  const rawTotalPages = Math.max(1, Math.ceil(safeTotalResults / safePerPage));
  const totalPages = Math.min(ALADIN_MAX_PAGES, rawTotalPages);
  return (
    <section className="max-w-7xl mx-auto flex flex-col gap-2">
      {/* <div className="w-full h-10 bg-red-500"></div> */}
      <Navbar maxWidth="full" position="static" className="[--navbar-height:auto] py-4 searchInput">
        <NavbarContent justify="start" className="flex flex-wrap items-center gap-2 gap-y-2 w-full">
          <Dropdown>
            <DropdownTrigger>
              <Button className="capitalize" color="danger" variant="solid" size="sm">
                {activeTabLabel}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="카테고리 선택"
              selectionMode="single"
              selectedKeys={new Set([queryType])}
              disallowEmptySelection
              color="danger"
              variant="solid"
              onAction={(key) => {
                const k = key as QueryType;
                setQueryType(k);
                setPage(1);
                if (k === 'ItemEditorChoice' && !categoryId) {
                  setCategoryId('170');
                }
              }}
            >
              {tabs.map((t) => (
                <DropdownItem key={t.key} className={'!text-xs'}>
                  {t.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const keyword = (formData.get('keyword') as string | null)?.trim() ?? '';
              if (!keyword) {
                toast.warn('검색어를 입력해주세요');
                return;
              }
              setSearchKeyWord(keyword.trim());
              setSearchPage(1);
            }}
            ref={formRef}
            className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 shadow-sm"
          >
            <input
              type="search"
              name="keyword"
              autoComplete="off"
              autoFocus
              placeholder="책 제목 또는 저자를 입력하세요"
              className="bg-transparent outline-none w-36 sm:w-40 text-xs placeholder-gray-400 placeholder:text-[9px]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white rounded-full hover:bg-black/70 transition-colors text-xs"
            >
              검색
            </button>
            <button
              type="button"
              className="px-4 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-500/70 transition-colors text-xs"
              onClick={() => {
                setSearchKeyWord(null);
                setSearchPage(1);
                formRef.current?.reset();
              }}
            >
              초기화
            </button>
          </form>
          {searchData &&
            (searchTotal > 0 ? (
              <p className="text-sm">검색결과 {searchTotal}개</p>
            ) : (
              <p className="text-sm">검색결과 없습니다.</p>
            ))}
        </NavbarContent>
      </Navbar>
      <div className="grid gap-y-6 gap-x-4 sm:gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-auto">
        {(isSearching ? searchPending : isPending)
          ? Array.from({ length: 20 }).map((_, index) => <SkeletonItem key={index} />)
          : list.map((item, index) => (
              <Link key={makeItemKey(item, index)} href={makeHref(item)}>
                <CategoryItem item={item} />
              </Link>
            ))}
      </div>
      {/* 페이지 네이션 */}
      <div className="mt-6 flex justify-center">
        <Pagination
          key={isSearching ? `search-${searchKeyWord}` : `list-${queryType}-${categoryId}`}
          isCompact
          showControls
          total={totalPages}
          page={isSearching ? searchPage : page}
          onChange={(p) => {
            const next = Math.min(totalPages, p);
            if (isSearching) setSearchPage(next);
            else setPage(next);
          }}
        />
      </div>
    </section>
  );
}
