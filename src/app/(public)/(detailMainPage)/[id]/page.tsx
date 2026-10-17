import { getAladinDetail } from '@/shared/lib/aladin/getAladinDetail';
import EmptyState from '@/components/common/EmptyState';
import { AladinItem } from '@/shared/domain/aladin/types';
import { createClient } from '@/shared/lib/supabase/server';
import { upsertBook } from '@/shared/lib/book/upsertBook';
import { getBookKey } from '@/shared/domain/book/getBookKey';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';
import { Suspense } from 'react';
import RelatedRailServer from './_components/Recommend/RelatedRailServer';
import BookInfoServer from './_components/BookInfo/BookInfoServer';
import CommentSkeleton from './_components/Comment/CommentSkeleton';
import CommentSection from './_components/Comment/CommentSection';
import BookInfoSkeleton from './_components/BookInfo/BookInfoSkeleton';

export const maxDuration = 60;

const MainDetail = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ commentPage?: string }>;
}) => {
  const supabase = await createClient();
  const { id } = await params;
  if (!id)
    return <EmptyState title="책 정보를 찾을 수 없어요11" description="주소를 다시 확인해 주세요." className="p-10" />;
  const { commentPage } = await searchParams;
  const page = Math.max(1, Number(commentPage ?? 1) || 1);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const data = await getAladinDetail(id);
  const item: AladinItem = data?.item?.[0];
  if (!item) {
    return (
      <EmptyState
        title="책 정보를 찾을 수 없어요"
        description="삭제되었거나 잘못된 링크일 수 있어요."
        className="py-10"
      />
    );
  }
  const isbnKey = getBookKey(item);

  let bookId: string | null = null;

  try {
    bookId = await upsertBook({
      supabase,
      bookInfo: {
        title: item.title,
        author: item.author,
        cover: item.cover,
        isbn13: isbnKey,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      },
    });
  } catch (error) {
    console.error('upsertBook 실패', error);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <Suspense fallback={<BookInfoSkeleton />}>
        <BookInfoServer userId={userId} item={item} />
      </Suspense>
      <div className="mt-8">
        <Suspense fallback={<CommentSkeleton />}>
          <CommentSection bookId={bookId} page={page} userId={userId} />
        </Suspense>
      </div>
      <Suspense fallback={<RailsSkeleton col={1} />}>
        <RelatedRailServer isbnKey={isbnKey} />
      </Suspense>
    </div>
  );
};

export default MainDetail;
