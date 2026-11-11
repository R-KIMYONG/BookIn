import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { ItemId } from '@/shared/domain/book/ids';
import { RailBook } from '@/shared/domain/rails/types';
import { getCachedAnchorRail } from '@/shared/lib/recommend/getCachedAnchorRail';
import { getBookStatsByItemIds } from '@/shared/lib/server/entities/getBookStatsByItemIds';
import { Sparkles } from 'lucide-react';

const RAIL_SIZE = 20;

// 디테일 "이 책과 비슷한 책": 이 책 소분류와 비슷한 분류의 베스트셀러 중 책소개가 가까운 순 (마이페이지 『○○』 레일과 같은 계산)
// 페이지 본문과 따로 Suspense로 감싸져 있어서, 처음 계산하는 동안에도 책 정보는 먼저 보임
const RelatedRailServer = async ({ itemId }: { itemId: ItemId }) => {
  let books: RailBook[] = [];
  try {
    books = (await getCachedAnchorRail(itemId, RAIL_SIZE))?.books ?? [];
  } catch (error) {
    // 추천 실패가 디테일 페이지를 깨뜨리지 않도록 빈 레일로
    console.error('비슷한 책 추천 실패:', error);
  }

  // 조회수·댓글수는 캐시하지 않고 매번 최신으로 붙임
  const stats = await getBookStatsByItemIds(books.map((book) => book.itemId));
  const booksView = books.map((book) => ({ ...book, stats: stats[book.itemId] }));

  return (
    <BookRail
      icon={<Sparkles className="h-4 w-4" />}
      label="이 책과 비슷한 책"
      books={booksView}
      emptyMessage="아직 비슷한 책을 찾지 못했어요."
    />
  );
};

export default RelatedRailServer;
