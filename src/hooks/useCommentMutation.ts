import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type SubmitItem = Pick<
  Tables<'comments'>,
  'user_id' | 'title' | 'content' | 'post_id' | 'writer' | 'cover' | 'updated_at' | 'book_title'
>;
type UpdateSubmitItem = SubmitItem & Pick<Tables<'comments'>, 'id'>;
export const useCommentMutation = (postId: string, userId?: string) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
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
        body: JSON.stringify(newComment),
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
