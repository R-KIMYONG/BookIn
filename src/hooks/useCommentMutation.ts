import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type SubmitItem = Pick<Tables<'comments'>, 'user_id' | 'content' | 'book_id' | 'updated_at'>;
type UpdateSubmitItem = SubmitItem & Pick<Tables<'comments'>, 'id'>;
export const useCommentMutation = (bookId: string, userId?: string) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', bookId] });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
    }
  };

  const add = useMutation({
    mutationFn: async (newComment: SubmitItem) => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newComment,
          book_id: bookId,
          user_id: userId,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '댓글 작성 실패');
      return result;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (data: UpdateSubmitItem) => {
      const res = await fetch('/api/comment', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '댓글 수정 실패');
      return result;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', bookId] });

      const previous = queryClient.getQueryData(['comments', bookId, 1]);

      queryClient.setQueryData(['comments', bookId, 1], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: [
            {
              id: 'temp-' + Date.now(),
              content: newComment.content,
              created_at: new Date().toISOString(),
              user_id: userId,
              users: { nickname: '나' }, // 또는 실제 nickname
            },
            ...old.data,
          ],
          total: old.total + 1,
        };
      });

      return { previous };
    },
    onError: (_err, _newComment, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['comments', bookId, 1], context.previous);
      }
    },

    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comment/?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '댓글 삭제에 실패했습니다.');
      return result;
    },
    onSuccess: invalidate,
  });

  return { add, update, remove };
};
