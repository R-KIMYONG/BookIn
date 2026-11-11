import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { getBookStatsByItemIds } from '@/shared/lib/server/entities/getBookStatsByItemIds';
import { Sparkles } from 'lucide-react';
import { BookSummary } from '@/shared/domain/book/types';
import { getCachedCategoryRail } from '@/shared/lib/recommend/buildCategoryRail';

const RAIL_SIZE = 20;

const CategoryRailServer = async ({ categoryId }: { categoryId: string }) => {
  let books: BookSummary[] = [];
  try {
    books = await getCachedCategoryRail(categoryId, RAIL_SIZE);
  } catch (error) {
    console.error('카테고리 추천 실패:', error); // 레일이 실패해도 카테고리 목록은 보이게
  }

  if (books.length === 0) return null;
  // 조회수·댓글수는 매번 최신으로
  const stats = await getBookStatsByItemIds(books.map((book) => book.itemId));
  const booksView = books.map((book) => ({ ...book, stats: stats[book.itemId] }));
  return (
    <BookRail
      icon={<Sparkles className="h-4 w-4" />}
      label="새로운 발견"
      books={booksView}
      emptyMessage="관련 추천을 찾지 못했습니다."
    />
  );
};

export default CategoryRailServer;
