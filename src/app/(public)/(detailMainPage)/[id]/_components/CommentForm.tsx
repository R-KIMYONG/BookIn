'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CommentFormProps } from '@/types/commentList.type';
import useCurrentUrl from '@/hooks/useCurrentUrl';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import dynamic from 'next/dynamic';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { SubmitItem, useCommentMutation } from '@/hooks/useCommentMutation';
import { sanitizeHtmlClient } from '@/app/lib/security/sanitizeHtml.client';

const TiptapEditor = dynamic(() => import('./TiptapEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

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
  const currentUrl = useCurrentUrl();
  const { add, update } = useCommentMutation(postId, userId);

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanContent: string = sanitizeHtmlClient(targetValue.content || '');

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
        ? update.mutateAsync({ ...newComment, id: targetValue.id })
        : add.mutateAsync(newComment);

    const pendingMessage = isEdit ? '댓글 수정중...' : '댓글 업로드중...';

    try {
      await toastMutationPromise(requestPromise, pendingMessage);
      handleCancelEdit();
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
          <TiptapEditor value={targetValue.content ?? ''} onChange={handleContentChange} />
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
