import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Comment from './Comment';
import { getCommentsServer } from '@/shared/lib/comment/getCommentsServer';
import { commentKeys } from '@/shared/domain/comment/queryKeys';

const CommentSection = async ({ bookId, page, userId }: { bookId: string; page: number; userId: string | null }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: commentKeys.list(bookId, page),
    queryFn: () => getCommentsServer({ bookId, page }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comment bookId={bookId} initialUserId={userId} initialPage={page} />
    </HydrationBoundary>
  );
};

export default CommentSection;
