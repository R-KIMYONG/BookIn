import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Comment from './Comment';
import { getCommentsServer } from '@/app/lib/comment/getCommentsServer';

const CommentSection = async ({ bookId, page, userId }: { bookId: string; page: number; userId: string | null }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['comments', bookId, 1],
    queryFn: () => getCommentsServer({ bookId, page }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comment bookId={bookId} initialUserId={userId} initialPage={page} />
    </HydrationBoundary>
  );
};

export default CommentSection;
