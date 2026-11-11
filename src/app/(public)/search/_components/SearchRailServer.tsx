import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { ItemId } from '@/shared/domain/book/ids';
import { RailBook } from '@/shared/domain/rails/types';
import { getCachedAnchorRail } from '@/shared/lib/recommend/getCachedAnchorRail';
import { getBookStatsByItemIds } from '@/shared/lib/server/entities/getBookStatsByItemIds';
import { getYes24List } from '@/shared/lib/yes24/getYes24List';
import { Sparkles } from 'lucide-react';

const RAIL_SIZE = 20;

type SearchRailServerProps = {
  resultItemIds: ItemId[]; // 지금 페이지의 검색 결과 (1위를 기준 책으로, 전체는 추천에서 제외)
};

// 검색 "이런 책은 어때요?": 검색 결과 1위 책과 비슷한 책 (디테일 "이 책과 비슷한 책"과 같은 계산·같은 캐시)
// 검색 결과에 이미 나온 책은 빼고, 추천이 비면 국내도서 베스트로 대신
const SearchRailServer = async ({ resultItemIds }: SearchRailServerProps) => {
  const [anchorItemId] = resultItemIds;
  const shown = new Set(resultItemIds);

  let books: RailBook[] = [];
  try {
    if (anchorItemId) {
      // 결과에 나온 책을 빼고도 RAIL_SIZE권이 남도록 넉넉히 받음 (디테일과 limit이 달라 캐시는 따로)
      const rail = await getCachedAnchorRail(anchorItemId, RAIL_SIZE * 2);
      books = (rail?.books ?? []).filter((book) => !shown.has(book.itemId)).slice(0, RAIL_SIZE);
    }
  } catch (error) {
    console.error('검색 추천 실패:', error);
  }

  // 추천 0권(검색 결과 없음·추천 실패) → 베스트셀러 폴백
  const isFallback = books.length === 0;
  if (isFallback) {
    const best = await getYes24List({ listType: 'bestseller', categoryId: '001', pageSize: RAIL_SIZE * 2 });
    books = best.items.filter((book) => !shown.has(book.itemId)).slice(0, RAIL_SIZE);
  }

  // 조회수·댓글수는 캐시하지 않고 매번 최신으로
  const stats = await getBookStatsByItemIds(books.map((book) => book.itemId));
  const booksView = books.map((book) => ({ ...book, stats: stats[book.itemId] }));

  return (
    <BookRail
      icon={<Sparkles className="h-4 w-4" />}
      label={isFallback ? '지금 인기 있는 책' : '이런 책은 어때요?'}
      books={booksView}
      emptyMessage="아직 추천을 준비하지 못했어요."
    />
  );
};

export default SearchRailServer;
