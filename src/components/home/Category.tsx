'use client';

import CategoryItem from './CategoryItem';
import Link from 'next/link';
import AppPagination from '../common/AppPagination';
import QueryTypeTabs from '../common/filters/QueryTypeTabs';
import SearchBar from '../common/filters/SearchBar';
import SkeletonGrid from '../common/SkeletonGrid';
import { useMemo } from 'react';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';
import { makeItemKey } from '@/shared/domain/book/makeItemKey';
import { makeHref } from '@/shared/domain/book/makeHref';
import { TargetTypes } from '@/shared/constants/category';
import { useBookListData } from '@/hooks/book/useBookListData';
import { useBookStats } from '@/hooks/book/useBookStats';
import { getBookKey } from '@/shared/domain/book/getBookKey';

type CategoryProps = {
  target: TargetTypes;
  page: number;
};

const Category = ({ target, page }: CategoryProps) => {
  const {
    list,
    queryType,
    listDataPending,
    totalPages,
    isFetching,
    searchTotal,
    searchKeyWord,
    searchQueryType,
    setListUrl,
  } = useBookListData({ target, page });
  const isSearching = Boolean(searchKeyWord?.trim());

  const isbnList = useMemo(() => {
    return list.map((item) => item.isbn13).filter(Boolean);
  }, [list]);
  useFetchLikeCount(isbnList);

  const { data: stats } = useBookStats(isbnList);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-2 overflow-x-hidden">
      <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-start md:justify-between py-4 box-border">
        <div className="md:flex-1 md:pr-3 w-full ">
          <QueryTypeTabs
            value={queryType}
            onChange={(k) => setListUrl({ queryType: k, searchKeyWord: null })}
            disable={isSearching}
          />
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <SearchBar
            value={searchKeyWord}
            isSearching={isFetching}
            searchQueryType={searchQueryType}
            onSubmit={(keyword) => setListUrl({ searchKeyWord: keyword, page: 1 })}
            onReset={() => setListUrl({ searchKeyWord: null, page: 1 })}
            onChangeSearchQueryType={(sq) => setListUrl({ searchQueryType: sq, page: 1 })}
          />

          {isSearching && (
            <p className="text-[12px] text-gray-600 text-nowrap md:pr-4 box-border pl-2">
              {isFetching
                ? '검색중...'
                : searchTotal > 0
                  ? `검색결과 ${searchTotal.toLocaleString()}개`
                  : '검색결과가 없습니다.'}
            </p>
          )}
        </div>
      </div>
      {listDataPending ? (
        <SkeletonGrid count={20} />
      ) : (
        <div className="w-full grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
      )}
      {/* 페이지 네이션 */}
      <div className="mt-6 flex justify-center">
        <AppPagination
          totalPages={totalPages}
          page={page}
          onChange={(p) => {
            setListUrl({ page: p });
          }}
        />
      </div>
    </section>
  );
};
export default Category;
