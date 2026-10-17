import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/shared/domain/comment/queryKeys';
import { fetchComments } from '@/shared/lib/comment/fetchComments';
import { createClient } from '@/shared/lib/supabase/server';
import dynamic from 'next/dynamic';
import CommentSkeleton from './CommentSkeleton';
import EmptyState from '@/components/common/EmptyState';

const Comment = dynamic(() => import('./index'), {
  loading: () => <CommentSkeleton />,
});

const CommentSection = async ({
  bookId,
  page,
  userId,
}: {
  bookId: string | null;
  page: number;
  userId: string | null;
}) => {
  if (!bookId) {
    return <EmptyState title="댓글을 불러올 수 없어요" description="잠시 후 다시 시도해 주세요." className="py-6" />;
  }
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    queryKey: commentKeys.list(bookId, page),
    queryFn: () => fetchComments(supabase, bookId, page),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comment bookId={bookId} initialUserId={userId} initialPage={page} />
    </HydrationBoundary>
  );
};

export default CommentSection;
