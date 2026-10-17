import React from 'react';
import ViewTracker from '../ViewTracker';
import Image from 'next/image';
import { Eye, Star } from 'lucide-react';
import DetailActionsContainer from '../DetailActionsContainer';
import DetailBookmarkTags from '../DetailBookmarkTags';
import { getCheapest } from '@/shared/domain/detail/getCheapest';
import { getDiscountRate } from '@/shared/domain/detail/getDiscountRate';
import { getSalesBadge, toneClass } from '@/shared/domain/detail/getSalesBadge';
import { AladinItem } from '@/shared/domain/aladin/types';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getLikesByIsbnList } from '@/shared/lib/server/entities/getLikesByIsbnList';
import { getLikeCountsByIsbnList } from '@/shared/lib/server/entities/getLikeCountsByIsbnList';
import { getBookmarksByIsbnList } from '@/shared/lib/server/entities/getBookmarksByIsbnList';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { getBookmarkTagsByIsbn } from '@/shared/lib/server/entities/getBookmarkTagsByIsbn';

import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { getBookKey } from '@/shared/domain/book/getBookKey';

const BookInfoServer = async ({ userId, item }: { userId: string | null; item: AladinItem }) => {
  const queryClient = new QueryClient();
  const isbnKey = getBookKey(item);

  const [likes, likeCounts, bookmarks, viewCount, bookmarkTags] = await Promise.all([
    getLikesByIsbnList([isbnKey]),
    getLikeCountsByIsbnList([isbnKey]),
    getBookmarksByIsbnList([isbnKey]),
    getBookStatsByIsbn([isbnKey]),
    userId ? getBookmarkTagsByIsbn(isbnKey) : Promise.resolve(null),
  ]);

  queryClient.setQueryData(likeKeys.detail(isbnKey), {
    isbn13: isbnKey,
    liked: likes[isbnKey] ?? false,
    liked_count: likeCounts[isbnKey] ?? 0,
  });

  queryClient.setQueryData(bookmarkKeys.detail(isbnKey), {
    isbn13: isbnKey,
    bookmarked: bookmarks[isbnKey]?.bookmarked ?? false,
    memoExists: bookmarks[isbnKey]?.memoExists ?? false,
  });

  if (userId && bookmarkTags)
    queryClient.setQueryData(bookmarkKeys.tags.detail(userId, isbnKey), { tags: bookmarkTags });
  //가격
  const standard = Number(item.priceStandard ?? 0);
  const sales = Number(item.priceSales ?? 0);
  const hasSale = standard > 0 && sales > 0 && sales < standard;

  const newDiscount = hasSale ? Math.round(((standard - sales) / standard) * 100) : 0;

  //신뢰 지표
  const rating = item.customerReviewRank ?? 0;
  const salesPoint = item.salesPoint ?? 0;

  //ebook
  const ebookList = item.subInfo?.ebookList;

  const ebookSources =
    ebookList?.map((e) => ({
      price: e.priceSales,
      link: e.link,
    })) ?? [];

  const cheapestEbook = getCheapest(ebookSources);

  //중고
  const usedList = item.subInfo?.usedList;

  const usedSources = [usedList?.aladinUsed, usedList?.spaceUsed, usedList?.userUsed]
    .filter((u) => (u?.itemCount ?? 0) > 0)
    .map((u) => ({
      price: u!.minPrice,
      link: u!.link,
      count: u!.itemCount,
    }));

  const cheapestUsed = getCheapest(usedSources);

  const totalUsedCount = usedSources.reduce((acc, cur) => acc + cur.count, 0);

  const minUsedPrice = usedSources.length > 0 ? Math.min(...usedSources.map((u) => u.price)) : null;

  //할인율
  const usedDiscount = cheapestUsed && standard ? getDiscountRate(standard, cheapestUsed.price) : 0;

  const ebookDiscount = cheapestEbook && standard ? getDiscountRate(standard, cheapestEbook.price) : 0;

  const category = item.categoryName?.split('>')?.pop() ?? '';
  const bookInfo = {
    isbn13: isbnKey,
    title: item.title,
    cover: item.cover,
    author: item.author,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
  };
  const salesBadge = getSalesBadge(salesPoint);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="rounded-2xl bg-white shadow">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
          <ViewTracker isbn13={isbnKey} />
          {/* 이미지 */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[220px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-black/5 bg-gray-50">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 220px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-4">
            {/* 제목 */}
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{item.title}</h1>
              <p className="text-sm text-gray-700">{item.author}</p>
              <p className="text-xs text-gray-400">{category}</p>
            </div>

            {/* 설명 */}
            {item.description && (
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <p className="text-sm text-gray-700 line-clamp-5">{item.description}</p>
              </div>
            )}

            {/* 지표 + 액션 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 메트릭 칩들 */}
              <div className="flex items-center gap-1.5 text-xs">
                {/* 조회수 — 0이어도 표시 */}
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span className="tabular-nums font-medium">{viewCount[isbnKey].view_count.toLocaleString()}</span>
                </span>

                {/* 평점 — 있을 때만 */}
                {rating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums font-medium">{rating}</span>
                  </span>
                )}

                {/* 판매량 — 있을 때만 */}
                {salesBadge && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${toneClass[salesBadge.tone]}`}
                  >
                    <salesBadge.Icon className="w-3.5 h-3.5 fill-current" />
                    {salesBadge.label}
                    <span className="tabular-nums font-semibold">{salesPoint.toLocaleString()}</span>
                  </span>
                )}
              </div>

              {/* 액션 (좋아요·북마크) — 칩과 분리, 오른쪽 */}
              <div className="ml-auto">
                <DetailActionsContainer bookInfo={bookInfo} />
              </div>
            </div>
            <div>
              <DetailBookmarkTags isbn13={isbnKey} userId={userId} />
            </div>
            <div className="rounded-xl border px-4 py-4 space-y-3">
              {/* 정가 */}
              {hasSale && <div className="text-sm text-gray-400 line-through">정가 {standard.toLocaleString()}원</div>}

              {/* 새책 */}
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{sales.toLocaleString()}원</span>
                {hasSale && <span className="text-sm font-semibold text-red-500">↓{newDiscount}%</span>}
              </div>

              {/* 적립 */}
              {item.mileage && <p className="text-xs text-gray-400">구매 시 {item.mileage.toLocaleString()}원 적립</p>}

              {/* ebook 비교 */}
              {cheapestEbook && (
                <div className="text-sm text-blue-600">
                  eBook {cheapestEbook.price.toLocaleString()}원
                  <span className="text-xs text-blue-400 ml-1">(정가 대비 ↓{ebookDiscount}%)</span>
                </div>
              )}

              {/* 중고 요약 */}
              {totalUsedCount > 0 && minUsedPrice && (
                <div className="text-sm text-gray-600">
                  중고 {totalUsedCount}개 · {minUsedPrice.toLocaleString()}원~
                  <span className="text-xs text-red-500 ml-1">(정가 대비 ↓{usedDiscount}%)</span>
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={item.link}
                  target="_blank"
                  className="px-3 py-1.5 rounded-md bg-[#af5858] text-white text-[11px] font-medium"
                >
                  새책 구매
                </a>

                {cheapestEbook && (
                  <a href={cheapestEbook.link} target="_blank" className="text-[11px] text-blue-600 hover:underline">
                    eBook 보기
                  </a>
                )}

                {cheapestUsed && (
                  <a href={cheapestUsed.link} target="_blank" className="text-[11px] text-gray-600 hover:underline">
                    중고 보기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default BookInfoServer;
