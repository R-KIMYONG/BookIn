'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '../../common/ui/Button';
import EmptyState from '../../common/EmptyState';
import CategoryItem from '../CategoryItem';
import { HomeBookGridSkeleton } from './HomeBookSectionSkeleton';
import { useBookStats } from '@/hooks/book/useBookStats';
import { useMyStatus } from '@/hooks/book/useMyStatus';
import { makeHref } from '@/shared/domain/book/makeHref';
import { HOME_LIST_SIZE, HOME_SECTIONS } from '@/shared/lib/yes24/constants';
import ListTypeTabs from '@/components/common/ui/ListTypeTabs';
import { useBookList } from '@/hooks/book/useBookList';
import BookLink from '@/components/book/BookLink';

type HomeBookSectionProps = {
  section: (typeof HOME_SECTIONS)[number];
};

// 탭은 섹션마다 독립 상태 (URL 하나로는 섹션 3개의 탭을 구분할 수 없음)
const HomeBookSection = ({ section }: HomeBookSectionProps) => {
  const { emoji, title, categoryId, tabs } = section;
  const [listType, setListType] = useState(tabs[0]);

  const { data, isPending, isFetching, isError, refetch } = useBookList({
    listType,
    categoryId,
    page: 1,
    pageSize: HOME_LIST_SIZE,
  });

  const books = useMemo(() => data?.items ?? [], [data]);
  const itemIds = useMemo(() => books.map((book) => book.itemId), [books]);

  // 기본 탭은 서버(prefetchBookInteractions)가 같은 키로 채워둠 → 다른 탭으로 바꿀 때만 요청
  const { data: stats } = useBookStats(itemIds);
  useMyStatus(itemIds);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
      <h2 className="text-lg font-bold sm:text-xl flex items-center gap-2">
        <span aria-hidden>{emoji}</span>
        {title}
      </h2>

      <ListTypeTabs tabs={tabs} active={listType} onChange={setListType} />

      {isPending ? (
        <HomeBookGridSkeleton />
      ) : isError ? (
        <div className="border rounded-xl p-6">
          <p className="font-semibold">목록을 불러오지 못했어요</p>
          <div className="mt-4">
            <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
          </div>
        </div>
      ) : books.length === 0 ? (
        <EmptyState title="표시할 책이 없어요" description="다른 탭을 선택해 보세요." showButton={false} />
      ) : (
        <div
          className={`flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible lg:grid-cols-5 lg:gap-8 ${isFetching ? 'opacity-60 ' : ''}transition-opacity`}
        >
          {books.map((book) => (
            <BookLink key={book.itemId} itemId={book.itemId} adult={book.adult} className="w-36 shrink-0 sm:w-auto">
              <CategoryItem
                item={book}
                viewCount={stats?.[book.itemId]?.view_count ?? 0}
                commentCount={stats?.[book.itemId]?.comment_count ?? 0}
              />
            </BookLink>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeBookSection;
