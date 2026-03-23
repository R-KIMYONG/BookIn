'use client';

import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import ButtonComponent from '../../../../../components/common/ButtonComponent';
import { CommentFormProps } from '@/types/commentList.type';
import useCommentsUrlState from '@/hooks/url/useCommentsUrlState';
import useCurrentUrl from '@/hooks/useCurrentUrl';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';

type SubmitItem = Pick<
  Tables<'comments'>,
  'user_id' | 'title' | 'content' | 'post_id' | 'writer' | 'cover' | 'updated_at'
> & { book_title: string };
type UpdateSubmitItem = SubmitItem & Pick<Tables<'comments'>, 'id'>;

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CommentForm = ({
  isEdit, //편집 상태
  targetValue, //수정대상의 내용
  setTargetValue, //수정대상의 내용을 제어
  userId, //사용자의 id
  cover, //책 표지 comment_book에 넣기용
  book_title,
  userNickName,
  handleCancelEdit,
  postId,
}: CommentFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUrl = useCurrentUrl();

  const handleContentChange = (value: string) => {
    if (value.length <= 200) {
      setTargetValue((prev) => ({ ...prev, content: value }));
    } else {
      toast.error('200자 이상은 작성 불가능합니다');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue((prev) => ({ ...prev, title: e.target.value }));
  };

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: SubmitItem) => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '댓글 작성 실패하였습니다.');

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
      handleCancelEdit();
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async (updatedComment: UpdateSubmitItem) => {
      const res = await fetch(`/api/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComment),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '댓글수정 싶패');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
      handleCancelEdit();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent: string = DOMPurify.sanitize(targetValue.content || '');

    if (!userId) {
      toast.error('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    const newComment: SubmitItem = {
      user_id: userId,
      title: targetValue.title || '',
      content: cleanContent,
      post_id: postId,
      writer: userNickName,
      updated_at: new Date().toISOString(),
      cover,
      book_title,
    };

    const requestPromise =
      isEdit && targetValue.id
        ? updateCommentMutation.mutateAsync({ ...newComment, id: targetValue.id })
        : addCommentMutation.mutateAsync(newComment);

    const pendingMessage = isEdit ? '댓글 수정중...' : '댓글 업로드중...';

    try {
      await toastMutationPromise(requestPromise, pendingMessage);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {userId ? (
        <form onSubmit={handleSubmit} className="bg-[#D9D9D9] p-6 mt-2 flex flex-col h-280px">
          <input
            type="text"
            placeholder="제목 입력"
            value={targetValue.title}
            onChange={handleTitleChange}
            required
            maxLength={20}
            className="w-[100%] h-[40px] p-2 text-lg"
          />
          <ReactQuill
            className="bg-white h-[150px] overflow-hidden"
            theme="snow"
            value={targetValue.content}
            onChange={handleContentChange}
          />
          <div className="flex gap-2 justify-end mt-6">
            <ButtonComponent variant="danger" size="xs" type="submit" label={isEdit ? '완료' : '업로드'} />
            {isEdit && (
              <ButtonComponent variant="secondary" size="xs" type="button" label="취소" onClick={handleCancelEdit} />
            )}
          </div>
        </form>
      ) : (
        <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-gray-700">댓글 작성은 로그인 후 이용할 수 있습니다.</p>
          <p className="mt-1 text-xs text-gray-500">회원가입 후 로그인하면 댓글을 남길 수 있어요.</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ButtonComponent
              type="button"
              variant="primary"
              size="sm"
              label="로그인"
              onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`)}
            />
            <ButtonComponent
              type="button"
              variant="outline"
              size="sm"
              label="회원가입"
              onClick={() => router.push(`/signup?redirectTo=${encodeURIComponent(currentUrl)}`)}
            />
            <ButtonComponent
              type="button"
              variant="secondary"
              size="sm"
              label="홈으로"
              onClick={() => router.push('/')}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default CommentForm;
