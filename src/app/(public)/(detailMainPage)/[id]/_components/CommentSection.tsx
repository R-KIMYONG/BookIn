import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Comment from './Comment';
import { getCommentsServer } from '@/app/lib/comment/getCommentsServer';

type CommentSectionProps = {
  bookId: string;
};
const CommentSection = async ({ bookId }: CommentSectionProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['comments', bookId, 1],
    queryFn: () => getCommentsServer({ bookId, page: 1 }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comment bookId={bookId} />
    </HydrationBoundary>
  );
};

export default CommentSection;
