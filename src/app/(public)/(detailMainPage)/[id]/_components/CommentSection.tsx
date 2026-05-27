import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/shared/domain/comment/queryKeys';
import { fetchComments } from '@/shared/lib/comment/fetchComments';
import { createClient } from '@/shared/lib/supabase/server';
import dynamic from 'next/dynamic';
import CommentSkeleton from './Comment/CommentSkeleton';
const Comment = dynamic(() => import('./Comment'), {
  loading: () => <CommentSkeleton />,
});

const CommentSection = async ({ bookId, page, userId }: { bookId: string; page: number; userId: string | null }) => {
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
