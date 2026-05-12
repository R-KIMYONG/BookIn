'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import Button from '@/components/common/ui/Button';
import AppPagination from '@/components/common/AppPagination';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useCommentMutation } from '@/hooks/comment/useCommentMutation';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { getCommentsClient } from '@/shared/lib/comment/getCommentsClient';
import { useClientPagination } from '@/hooks/url/useClientPagination';
import { Tables } from '@/shared/types/supabase';
import { MINUTE } from '@/shared/constants/time';
import { commentKeys } from '@/shared/domain/comment/queryKeys';

type CommentListProps = {
  isEdit: boolean;
  userId: string | null;
  handleStartEdit: (comment: Tables<'comments'>) => void;
  handleCancelEdit: () => void;
  editingId: string | null;
  bookId: string;
  initialPage: number;
};
const CommentList = ({
  isEdit,
  userId,
  handleStartEdit,
  handleCancelEdit,
  editingId,
  bookId,
  initialPage,
}: CommentListProps) => {
  const { remove } = useCommentMutation(bookId, userId);
  const { page, setPage } = useClientPagination({ paramKey: 'commentPage', defaultPage: initialPage });
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  const {
    data: comments,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: commentKeys.list(bookId, page),
    queryFn: () => getCommentsClient({ bookId, page }),
    enabled: !!bookId,
    staleTime: 1 * MINUTE,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id: string) => {
    try {
      await toastMutationPromise(remove.mutateAsync(id), { pending: '댓글 삭제중...' });
      onClose();
      setTargetDeleteId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setTargetDeleteId(null);
    onClose();
  };

  if (isPending)
    return (
      <div className="w-[100%] flex justify-center">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-[#AF5858] rounded-full animate-spin" />
      </div>
    );

  if (isError) {
    console.error(error);
    return (
      <div className="w-full flex justify-center">
        <p className="text-sm text-red-500">댓글을 불러오지 못했습니다.</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil((comments.total ?? 0) / DEFAULT_PAGE_SIZE));
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">코멘트</h3>
          <p className="mt-1 text-xs text-gray-500">
            총 <span className="font-bold text-[#AF5858]">{comments.total}</span>개
          </p>
        </div>
      </div>
      <div className="border-y-2 border-black py-6">
        {comments.data.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-gray-700">아직 댓글이 없어요</p>
            <p className="mt-1 text-xs text-gray-500">첫 댓글을 남겨보세요.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {comments.data.map((comment) => {
              const { id, content, users, created_at, user_id } = comment;
              const date = dayjs(created_at).locale('ko').format('YYYY-MM-DD HH:mm');
              const isMine = userId === user_id;

              return (
                <li key={id} className="py-5">
                  {/* 헤더: 제목 + 날짜 */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{users?.nickname}</span>
                      <span>·</span>
                      <span>{date}</span>
                    </div>

                    {isMine ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          label={isEdit && id === editingId ? '취소' : '수정'}
                          onClick={() => (isEdit && editingId === id ? handleCancelEdit() : handleStartEdit(comment))}
                        />
                        <Button
                          variant="danger"
                          size="xs"
                          label="삭제"
                          onClick={() => {
                            setTargetDeleteId(id);
                            onOpen();
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div
                    className="mt-2 text-sm leading-7 text-gray-800 break-words
                     prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                  />

                  {isEdit && editingId === id && <p className="mt-2 text-xs text-[#AF5858] font-semibold">수정 중…</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmModal
        isOpen={isOpen}
        title="댓글 삭제"
        message="삭제 시 복구가 어렵습니다. 정말 삭제하시겠습니까?"
        confirmColor="danger"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => {
          if (!targetDeleteId) return;
          handleDelete(targetDeleteId);
        }}
        onClose={handleCloseModal}
      />

      <AppPagination page={page} totalPages={totalPages} disabled={isFetching} onChange={setPage} />
    </div>
  );
};

export default CommentList;
