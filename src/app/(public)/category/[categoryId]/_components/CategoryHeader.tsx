'use client';

import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/ui/Button';
import QueryTypeTabs from '@/components/common/filters/QueryTypeTabs';
import InvalidCategory from './InvalidCategory';
import { Genre } from '@/shared/domain/category/types';
import { classifyCategory } from '@/shared/domain/category/classifyCategory';
import { TargetTypes } from '@/shared/constants/category';
import { useBookListData } from '@/hooks/book/useBookListData';

type CategoryHeaderProps = {
  categoryId: number;
  koreanGenres: Genre[];
  foreignGenres: Genre[];
  ebookGenres: Genre[];
  target: TargetTypes;
};

const CategoryHeader = ({ categoryId, koreanGenres, foreignGenres, ebookGenres, target }: CategoryHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { isValidCategory, groupLabel, genreData } = useMemo(
    () => classifyCategory({ categoryId, koreanGenres, foreignGenres, ebookGenres }),
    [koreanGenres, foreignGenres, ebookGenres, categoryId]
  );

  const { queryType, isFetching, searchTotal, isSearching, searchKeyWord, searchQueryType, setListUrl } =
    useBookListData({
      target,
      categoryId,
    });

  if (!isValidCategory) return <InvalidCategory />;

  const handleTabClick = (id: number) => {
    const params = new URLSearchParams({ target, page: '1', qt: queryType });
    startTransition(() => {
      router.push(`/category/${id}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <p className="font-bold border-b text-center pb-3">{groupLabel}</p>

      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <QueryTypeTabs
          value={queryType}
          onChange={(k) => setListUrl({ queryType: k, searchKeyWord: null, page: 1 })}
          target={target}
          disable={isPending}
        />
        {/* <div className="flex flex-col items-start md:items-end gap-1">
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
        </div> */}
      </div>

      <nav
        role="tablist"
        className="border rounded-lg px-3 w-fit h-fit py-3 flex gap-2 box-border flex-row items-start"
      >
        <ul className="flex gap-2 w-fit flex-wrap">
          {genreData.map((tab, index) => {
            const active = tab.id === categoryId;
            return (
              <Button
                key={`${tab.id}-${tab.label}-${index}`}
                size="xs"
                variant={active ? 'primary' : 'secondary'}
                label={tab.label}
                disabled={isPending}
                onClick={() => {
                  if (active) return;
                  handleTabClick(tab.id);
                }}
              />
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default CategoryHeader;
