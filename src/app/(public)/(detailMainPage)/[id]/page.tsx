import EmptyState from '@/components/common/EmptyState';
import { upsertBook } from '@/shared/lib/book/upsertBook';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';
import { Suspense } from 'react';
import RelatedRailServer from './_components/Recommend/RelatedRailServer';
import BookInfoServer from './_components/BookInfo/BookInfoServer';
import CommentSkeleton from './_components/Comment/CommentSkeleton';
import CommentSection from './_components/Comment/CommentSection';
import BookInfoSkeleton from './_components/BookInfo/BookInfoSkeleton';
import { getYes24Detail } from '@/shared/lib/yes24/getYes24Detail';
import { parseItemId } from '@/shared/domain/book/ids';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';
import AdultBlocked from './_components/AdultBlocked';

export const maxDuration = 60;

const MainDetail = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ commentPage?: string }>;
}) => {
  const { id } = await params;
  const { commentPage } = await searchParams;
  const page = Math.max(1, Number(commentPage ?? 1) || 1);
  const user = await getCurrentUser();
  const userId = user?.id ?? null;

  const itemId = parseItemId(id);
  if (!itemId) notFound();

  const book = await getYes24Detail(itemId);

  if (!book) {
    return (
      <EmptyState
        title="책 정보를 찾을 수 없어요"
        description="삭제되었거나 잘못된 링크일 수 있어요."
        className="py-10"
      />
    );
  }

  if (book.adult) return <AdultBlocked title={book.title} link={book.link} />;

  let bookId: string | null = null;

  try {
    bookId = await upsertBook(book);
  } catch (error) {
    console.error('upsertBook 실패', error);
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <Suspense fallback={<BookInfoSkeleton />}>
        <BookInfoServer userId={userId} book={book} />
      </Suspense>
      <div id="comments" className="mt-8 scroll-mt-24">
        <Suspense fallback={<CommentSkeleton />}>
          <CommentSection bookId={bookId} page={page} userId={userId} />
        </Suspense>
      </div>
      <Suspense fallback={<RailsSkeleton col={1} />}>
        <RelatedRailServer itemId={book.itemId} />
      </Suspense>
    </div>
  );
};

export default MainDetail;
