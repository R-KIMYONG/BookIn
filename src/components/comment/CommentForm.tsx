'use client';

import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import ButtonComponent from '../common/ButtonComponent';
import { CommentFormProps } from '@/types/commentList.type';
import useCommentsUrlState from '@/hooks/url/useCommentsUrlState';
import ConfirmModal from '../modal/ConfirmModal';
import { useDisclosure } from '@nextui-org/react';
import useCurrentUrl from '@/hooks/useCurrentUrl';

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
  const { page } = useCommentsUrlState();
  const currentUrl = useCurrentUrl();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRequireLogin = () => {
    onOpen();
  };

  const handleContentChange = (value: string) => {
    if (!userId) {
      handleRequireLogin();
      return;
    }
    if (value.length <= 200) {
      setTargetValue((prev) => ({ ...prev, content: value }));
    } else {
      toast.error('230자 이상은 작성 불가능합니다');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) {
      handleRequireLogin();
      return;
    }
    setTargetValue((prev) => ({ ...prev, title: e.target.value }));
  };

  const addComment = async (newComment: SubmitItem) => {
    const response = await fetch('/api/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    });

    return response.json();
  };

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId, page] });
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId, page] });
      handleCancelEdit();
      toast.success('작성 완료');
    },
  });

  const updateComment = async (updatedComment: UpdateSubmitItem) => {
    const response = await fetch(`/api/comment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedComment),
    });

    return response.json();
  };

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId, page] });
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId, page] });
      handleCancelEdit();
      toast.success('수정 완료');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent: string = DOMPurify.sanitize(targetValue.content || '');

    const newComment: SubmitItem = {
      user_id: userId || '',
      title: targetValue.title || '',
      content: cleanContent,
      post_id: postId,
      writer: userNickName,
      updated_at: new Date().toISOString(),
      cover,
      book_title,
    };

    if (isEdit && targetValue.id) {
      const updatedComment = { ...newComment, id: targetValue.id };
      updateMutation.mutate(updatedComment);
    } else {
      addMutation.mutate(newComment);
    }
  };

  return (
    <>
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
      <ConfirmModal
        isOpen={isOpen}
        title="로그인 필요"
        message="로그인 후 이용 가능합니다. 로그인 하시겠습니까?"
        confirmColor="primary"
        confirmLabel="로그인"
        cancelLabel="취소"
        onConfirm={() => {
          onClose();
          router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`);
        }}
        onClose={onClose}
      />
    </>
  );
};
export default CommentForm;
