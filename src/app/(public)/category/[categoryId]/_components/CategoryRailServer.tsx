import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { getRelatedBooks } from '@/shared/lib/rails/getRelatedBooks';
import { Sparkles } from 'lucide-react';
import React from 'react';

const CategoryRailServer = async ({ categoryPath, mall }: { categoryPath?: string; mall?: string }) => {
  const related = await getRelatedBooks(undefined, categoryPath, mall);
  const stats = await getBookStatsByIsbn(related.map((b) => b.isbn13));
  const relatedView = related.map((b) => ({ ...b, stats: stats[b.isbn13] }));
  return (
    <BookRail
      icon={<Sparkles className="h-4 w-4" />}
      label="새로운 발견"
      books={relatedView}
      emptyMessage="관련 추천을 찾지 못했습니다."
    />
  );
};

export default CategoryRailServer;
