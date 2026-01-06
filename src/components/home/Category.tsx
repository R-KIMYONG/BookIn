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
import { Book, Item } from '@/types/book.type';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import SkeletonItem from './SkeletonItem';
import Link from 'next/link';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
type QueryType = 'Bestseller' | 'ItemNewAll' | 'ItemNewSpecial' | 'BlogBest' | 'ItemEditorChoice';

export default function Category() {
  const [queryType, setQueryType] = useState<QueryType>('Bestseller');
  const [page, setPage] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>('');

  const itemsPerPage = 10;
  const { data: bookItem, isPending } = useQuery<Item[], Error>({
    queryKey: ['books', queryType, page, itemsPerPage, categoryId],
    queryFn: async ({ queryKey }) => {
      const [_, qt, p, lim, cat] = queryKey as [string, QueryType, number, number, string];

      const url =
        `/api/AladinApi?QueryType=${qt}` +
        `&page=${p}` +
        `&limit=${lim}` +
        (qt === 'ItemEditorChoice' && cat ? `&CategoryId=${encodeURIComponent(cat)}` : '');

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`AladinApi ${res.status}`);
      const json: Book = await res.json();
      return json.item ?? [];
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: keepPreviousData,
  });

  const [searchKeyWord, setSearchKeyWord] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['search', searchKeyWord, page, itemsPerPage],
    queryFn: async ({ queryKey }) => {
      const [_, kw, page, limit] = queryKey as [string, string, number, number];
      const res = await fetch(`/api/SearchAladin?SearchKeyWord=${encodeURIComponent(kw)}&page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error('검색 실패');

      return (await res.json()) as { items: Item[]; total: number };
    },
    staleTime: 30000,
    enabled: !!searchKeyWord,
  });

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

  return (
    <section className="max-w-7xl mx-auto flex flex-col gap-2">
      {/* <div className="w-full h-10 bg-red-500"></div> */}
      <Navbar maxWidth="full" position="static" className="[--navbar-height:auto] py-4">
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
              setSearchKeyWord(keyword);
            }}
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
              className="px-4 py-1.5 bg-black text-white rounded-full hover:bg-black/90 transition-colors text-xs"
            >
              검색
            </button>
          </form>
        </NavbarContent>
      </Navbar>
      <div className="grid gap-y-6 gap-x-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-auto">
        {isPending
          ? Array.from({ length: itemsPerPage }).map((_, index) => <SkeletonItem key={index} />)
          : bookItem?.map((item, index) => (
              <Link key={makeItemKey(item, index)} href={makeHref(item)}>
                <CategoryItem item={item} />
              </Link>
            ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination
          isCompact
          showControls
          total={queryType === 'BlogBest' ? 10 : 100}
          page={page}
          onChange={(page) => setPage(page)}
        />
      </div>
    </section>
  );
}
