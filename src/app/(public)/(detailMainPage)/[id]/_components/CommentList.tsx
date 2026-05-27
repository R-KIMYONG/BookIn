'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import Button from '@/components/common/ui/Button';
import AppPagination from '@/components/common/AppPagination';
import { useCommentMutation } from '@/hooks/comment/useCommentMutation';
import { DEFAULT_PAGE_SIZE } from '@/shared/constants/pagination';
import { useClientPagination } from '@/hooks/url/useClientPagination';
import { MINUTE } from '@/shared/constants/time';
import { commentKeys } from '@/shared/domain/comment/queryKeys';
import { formatDateTime } from '@/shared/lib/date/formatDateTime';
import { getCommentList } from '@/shared/lib/comment/getCommentList';
import { CommentListResult, CommentWithUser } from '@/shared/domain/comment/types';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ConfirmModal = dynamic(() => import('@/components/modal/ConfirmModal'), { ssr: false });
type CommentListProps = {
  isEdit: boolean;
  userId: string | null;
  handleStartEdit: (comment: CommentWithUser) => void;
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
  } = useQuery<CommentListResult>({
    queryKey: commentKeys.list(bookId, page),
    queryFn: async () => getCommentList({ bookId, page }),
    enabled: !!bookId,
    staleTime: 5 * MINUTE,
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
  const totalPages = Math.max(1, Math.ceil((comments?.total ?? 0) / DEFAULT_PAGE_SIZE));

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
              const date = formatDateTime(created_at);
              const isMine = userId === user_id;

              return (
                <li key={id} className="py-6 transition-colors">
                  <div className="flex gap-4">
                    {/* 아바타 파트 */}
                    <div className="shrink-0">
                      <Image
                        src={users?.avatar || '/images/noImg.png'}
                        alt={`${users?.nickname ?? '유저'} 프로필`}
                        width={35}
                        height={35}
                        className="rounded-full object-cover border border-gray-200 bg-gray-100 "
                      />
                    </div>

                    {/* 댓글 파트 */}
                    <div className="flex-1 min-w-0">
                      {/* header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{users?.nickname}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{date}</p>
                        </div>

                        {isMine ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="xs"
                              label={isEdit && id === editingId ? '취소' : '수정'}
                              onClick={() =>
                                isEdit && editingId === id ? handleCancelEdit() : handleStartEdit(comment)
                              }
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

                      {/* 내용 */}
                      <div
                        className="mt-3 text-sm leading-7 text-gray-800 break-words prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: content || '',
                        }}
                      />

                      {/* 편집중 */}
                      {isEdit && editingId === id && (
                        <div className="mt-3">
                          <span className="inline-flex items-center rounded-full bg-[#AF5858]/10 px-2.5 py-1 text-[11px] font-semibold text-[#AF5858]">
                            수정 중
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
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
