import { getCommentsServer } from '@/app/lib/comment/getCommentsServer';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Comment from './Comment';

type CommentSectionProps = {
  postId: string;
  cover: string;
  book_title: string;
};
const CommentSection = async ({ postId, cover, book_title }: CommentSectionProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['comments', postId, 1],
    queryFn: () => getCommentsServer({ postId, page: 1 }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comment cover={cover} book_title={book_title} />
    </HydrationBoundary>
  );
};

export default CommentSection;
