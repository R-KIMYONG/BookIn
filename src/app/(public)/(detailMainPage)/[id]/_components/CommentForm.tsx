'use client';

import { toast } from 'react-toastify';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import dynamic from 'next/dynamic';
import Button from '@/components/common/ui/Button';
import { useCommentMutation } from '@/hooks/comment/useCommentMutation';
import { sanitizeHtmlClient } from '@/shared/utils/security/sanitizeHtml.client';
import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react';
import type { Editor } from '@tiptap/react';
import { MAX_LENGTH, MAX_LINES } from '@/shared/constants/comment';
import { TargetValue } from './Comment/types';
import { SubmitItem } from '@/shared/domain/comment/types';

const TiptapEditor = dynamic(() => import('./TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80px] px-3 py-2 text-sm text-gray-400 flex items-center gap-2">
      <div className="h-3 w-3 border-2 border-gray-300 border-t-[#AF5858] rounded-full animate-spin" />
      <span>댓글 입력을 준비하고 있어요…</span>
    </div>
  ),
});

type CommentFormProps = {
  isEdit: boolean;
  targetValue: TargetValue;
  setTargetValue: Dispatch<SetStateAction<TargetValue>>;
  comment?: TargetValue | undefined;
  userId: string | undefined;
  handleCancelEdit: () => void;
  bookId: string;
};

const CommentForm = ({
  isEdit, //편집 상태
  targetValue, //수정대상의 내용
  setTargetValue, //수정대상의 내용을 제어
  userId, //사용자의 id
  handleCancelEdit,
  bookId,
}: CommentFormProps) => {
  const { add, update } = useCommentMutation(bookId, userId);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const handleContentChange = (html: string, textLength: number) => {
    if (textLength > MAX_LENGTH) {
      toast.error('200자 이상은 작성 불가능합니다');
      return;
    }
    setTargetValue((prev) => ({ ...prev, content: html }));
  };

  const handleEditorReady = useCallback((editor: Editor) => {
    setEditorInstance(editor);
  }, []);
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanContent: string = sanitizeHtmlClient(targetValue.content || '');

    if (!userId) {
      toast.error('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    const newComment: SubmitItem = {
      user_id: userId,
      content: cleanContent,
      book_id: bookId,
      updated_at: new Date().toISOString(),
    };

    if (isEdit && targetValue.id) {
      await handleUpdate(newComment);
    } else {
      await handleCreate(newComment);
    }
  };

  const handleCreate = async (newComment: SubmitItem) => {
    try {
      await add.mutateAsync(newComment);

      handleCancelEdit();
    } catch (error) {
      toast.error('댓글 등록 실패');
    }
  };

  const handleUpdate = async (newComment: SubmitItem) => {
    if (!targetValue.id) return;

    try {
      await toastMutationPromise(update.mutateAsync({ ...newComment, id: targetValue.id }), {
        pending: '댓글 수정중...',
      });

      handleCancelEdit();
    } catch (error) {
      console.error(error);
    }
  };
  const getTextLength = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;

    return (div.textContent || '').replace(/\n/g, '').length;
  };
  const textLength = getTextLength(targetValue.content ?? '');
  const isDisabled = textLength === 0 || update.isPending;
  const lineCount = editorInstance ? editorInstance.state.doc.content.childCount : 1;
  return (
    <>
      <form onSubmit={handleSubmit} ref={formRef} className="mt-4 border-t pt-4">
        <div className="flex flex-col justify-end gap-1 h-full">
          {/* 입력 영역 */}
          <div
            className="flex-1 rounded-md border border-gray-200 px-3 py-2 focus-within:border-[#AF5858]"
            onClick={() => editorInstance?.commands.focus()}
          >
            <TiptapEditor
              value={targetValue.content ?? ''}
              placeholder="댓글을 입력하세요."
              maxLength={MAX_LENGTH}
              maxLines={MAX_LINES}
              onChange={handleContentChange}
              onReady={handleEditorReady}
              onSubmitShortcut={() => formRef.current?.requestSubmit()}
            />

            {/* 룰 */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400 select-none">
              <span>Enter 줄바꿈 · ⌘/Ctrl + Enter 등록</span>

              <div className="flex items-center gap-3">
                <span>
                  {lineCount} / {MAX_LINES}줄
                </span>
                <span>
                  {textLength} / {MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* 버튼 - 옆으로 이동 */}
          <div className="flex items-end gap-2">
            <Button
              variant="primary"
              size="sm"
              type="submit"
              label={isEdit ? '수정' : '등록'}
              // className="h-8 px-3 text-xs"
              disabled={isDisabled}
            />

            <Button
              variant="secondary"
              size="sm"
              type="button"
              label="취소"
              onClick={handleCancelEdit}
              // className="text-[11px] text-gray-400 hover:text-gray-600"
              disabled={isDisabled}
            />
          </div>
          <details className="mt-2 text-xs text-gray-400">
            <summary className="cursor-pointer">댓글 작성 가이드</summary>
            <ul className="mt-2 space-y-1.5 pl-3">
              <li>• 타인을 비방하거나 불쾌감을 주는 표현은 제한됩니다</li>
              <li>• 책 내용 관련 스포일러는 주의해주세요</li>
              <li>• 광고, 홍보, 반복 게시글은 삭제될 수 있습니다</li>
              <li>• 주제와 관련 없는 댓글은 숨김 처리될 수 있습니다</li>
            </ul>
          </details>
        </div>
      </form>
    </>
  );
};
export default CommentForm;
