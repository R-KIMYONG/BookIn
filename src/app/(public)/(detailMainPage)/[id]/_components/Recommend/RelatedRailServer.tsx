import BookRail from '@/app/(private)/mypage/_components/recommend/rail/BookRail';
import { getBookStatsByIsbn } from '@/shared/lib/aladin/getBookStatsByIsbn';
import { getRelatedBooks } from '@/shared/lib/rails/getRelatedBooks';
import { Sparkles } from 'lucide-react';
import React from 'react';

const RelatedRailServer = async ({ isbnKey }: { isbnKey: string }) => {
  const related = await getRelatedBooks(isbnKey);

  if (related.length === 0) {
    return (
      <BookRail
        icon={<Sparkles className="h-4 w-4" />}
        label="이 책과 비슷한 책"
        books={[]}
        emptyMessage="아직 이 책과 비슷한 책을 찾지 못했어요. 조금만 기다려 주세요."
      />
    );
  }

  const stats = await getBookStatsByIsbn(related.map((b) => b.isbn13));
  const relatedView = related.map((b) => ({ ...b, stats: stats[b.isbn13] }));
  return <BookRail icon={<Sparkles className="h-4 w-4" />} label="이 책과 비슷한 책" books={relatedView} />;
};

export default RelatedRailServer;
