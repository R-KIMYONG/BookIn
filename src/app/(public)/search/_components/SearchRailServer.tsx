import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { getRelatedBooks } from '@/shared/lib/rails/getRelatedBooks';
import { getTrending } from '@/shared/lib/rails/getchTrending';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { Sparkles } from 'lucide-react';

type SearchRailServerProps = {
  itemListSet: string[]; // 검색 결과 isbn (1위를 anchor로, 전체는 중복 제거)
  categoryId: number;
};

const SearchRailServer = async ({ itemListSet, categoryId }: SearchRailServerProps) => {
  // 검색 결과 1위 책 기준 book-to-book 유사검색 (검증된 경로 = detail 레일과 동일)
  let books: Awaited<ReturnType<typeof getRelatedBooks>> = [];
  if (itemListSet.length > 0) {
    const related = await getRelatedBooks(itemListSet[0]);
    const exclude = new Set(itemListSet);
    books = related.filter((b) => !exclude.has(b.isbn13)).slice(0, 20);
  }

  // 추천 0권(결과 없음/1위 미임베딩) → 베스트셀러 폴백
  const isFallback = books.length === 0;
  if (isFallback) {
    books = (await getTrending(categoryId || 0)).slice(0, 20);
  }

  // 조회수·댓글수 등 지표 붙이기 (RelatedRailServer와 동일)
  const stats = await getBookStatsByIsbn(books.map((b) => b.isbn13));
  const booksView = books.map((b) => ({ ...b, stats: stats[b.isbn13] }));

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
