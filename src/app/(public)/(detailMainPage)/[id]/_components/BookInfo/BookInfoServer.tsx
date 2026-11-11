import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getDiscountRate } from '@/shared/domain/detail/getDiscountRate';
import { getSalesBadge, toneClass } from '@/shared/domain/detail/getSalesBadge';
import { BookDetail } from '@/shared/domain/book/types';
import ViewTracker from '../ViewTracker';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchBookInteractions } from '@/shared/lib/server/entities/prefetchBookInteractions';
import DetailSidePanel from './DetailSidePanel';

// TODO(D2: 상호작용 itemId 전환) 아래 기능을 itemId 기준으로 복구
//   - 좋아요·북마크·통계·태그 미리 채우기 (getLikesByIsbnList 등 → HydrationBoundary)
//   - 조회수 칩
//   - DetailActionsContainer (좋아요·북마크·메모 버튼), DetailBookmarkTags

type BookInfoServerProps = {
  userId: string | null;
  book: BookDetail;
};

const BookInfoServer = async ({ book, userId }: BookInfoServerProps) => {
  const queryClient = new QueryClient();

  // 가격
  const { shopPrice, salePrice } = book;
  const hasSale = shopPrice > 0 && salePrice > 0 && salePrice < shopPrice;
  const discount = hasSale ? getDiscountRate(shopPrice, salePrice) : 0;

  // 신뢰 지표
  const salesBadge = getSalesBadge(book.salePoint);

  await prefetchBookInteractions(queryClient, [book.itemId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="rounded-2xl bg-white shadow">
        <ViewTracker itemId={book.itemId} />
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
          {/* 이미지 */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-[220px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-black/5 bg-gray-50">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 220px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <DetailSidePanel itemId={book.itemId} userId={userId} />
              </div>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-4">
            {/* 제목 */}
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{book.title}</h1>
              {book.subTitle && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{book.subTitle}</p>}
              <p className="mt-1 text-sm text-gray-700">{book.author}</p>
              <p className="text-xs text-gray-400">
                {[book.publisher, book.pubDate, book.categoryName, book.pages ? `${book.pages}쪽` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>

            {/* 책 소개 */}
            {book.description && (
              <div className="bg-gray-50 px-4 py-4 rounded-xl">
                <p className="text-sm text-gray-700 line-clamp-5 whitespace-pre-line">{book.description}</p>
              </div>
            )}

            {/* 지표 */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* 평점 (YES24 10점 만점) — 있을 때만 */}
              {book.starScore !== null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums font-medium">{book.starScore}</span>
                  <span className="text-amber-500">/ 10</span>
                </span>
              )}

              {/* 판매지수 — 있을 때만 */}
              {salesBadge && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${toneClass[salesBadge.tone]}`}
                >
                  <salesBadge.Icon className="w-3.5 h-3.5 fill-current" />
                  {salesBadge.label}
                  <span className="tabular-nums font-semibold">{book.salePoint.toLocaleString()}</span>
                </span>
              )}
            </div>

            {/* 가격 (YES24 상세 응답 기준, 저장하지 않고 5분 캐시로 표시) */}
            <div className="rounded-xl border px-4 py-4 space-y-3">
              {hasSale && <div className="text-sm text-gray-400 line-through">정가 {shopPrice.toLocaleString()}원</div>}

              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-900">{salePrice.toLocaleString()}원</span>
                {hasSale && <span className="text-sm font-semibold text-red-500">↓{discount}%</span>}
              </div>

              {book.yesPoint > 0 && (
                <p className="text-xs text-gray-400">구매 시 {book.yesPoint.toLocaleString()}원 적립</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md bg-[#af5858] text-white text-[11px] font-medium"
                >
                  YES24에서 보기
                </a>

                {book.ebookLink && (
                  <a
                    href={book.ebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    eBook 보기
                  </a>
                )}
              </div>

              {/* 출처 표기 (YES24 Open API 약관 필수) */}
              <p className="text-[10px] text-gray-400">도서 정보·가격 제공: YES24 (실제 판매가와 다를 수 있어요)</p>
            </div>

            {/* 목차 */}
            {book.toc && (
              <details className="rounded-xl border px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">목차</summary>
                <p className="mt-3 text-xs leading-6 text-gray-600 whitespace-pre-line">{book.toc}</p>
              </details>
            )}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default BookInfoServer;
