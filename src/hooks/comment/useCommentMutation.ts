import { commentKeys } from '@/shared/domain/comment/queryKeys';
import { CommentListResult, SubmitItem } from '@/shared/domain/comment/types';
import { myBooksKeys } from '@/shared/domain/mybooks/queryKeys';
import { rankingKeys } from '@/shared/domain/ranking/queryKeys';
import { createComment } from '@/shared/lib/comment/createComment';
import { deleteComment } from '@/shared/lib/comment/deleteComment';
import { updateComment } from '@/shared/lib/comment/updateComment';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCommentMutation = (bookId: string, userId?: string | null) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: commentKeys.all });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: commentKeys.byUser(userId) });
      queryClient.invalidateQueries({ queryKey: myBooksKeys.all });
      queryClient.invalidateQueries({ queryKey: rankingKeys.topViewBooks(5) });
    }
  };

  const add = useMutation({
    mutationFn: (input: SubmitItem) => createComment({ ...input, bookId, userId }),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(bookId, 1) });

      const prev = queryClient.getQueryData<CommentListResult>(commentKeys.list(bookId, 1));

      queryClient.setQueryData(commentKeys.list(bookId, 1), (old: CommentListResult) => {
        if (!old) return old;

        return {
          ...old,
          data: [
            {
              id: 'temp-' + Date.now(),
              content: newComment.content,
              created_at: new Date().toISOString(),
              user_id: userId,
              users: { nickname: '나' },
            },
            ...old.data,
          ],
          total: old.total + 1,
        };
      });
      return { prev };
    },

    onError: (_err, _newComment, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          commentKeys.list(bookId, 1),

          context.prev
        );
      }
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: updateComment,
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteComment,
    onSuccess: invalidate,
  });

  return { add, update, remove };
};
