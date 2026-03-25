'use client';

import { Spinner, useDisclosure } from '@nextui-org/react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import useCommentsUrlState from '@/hooks/url/useCommentsUrlState';
import { CommentListProps, CommentListResult } from '@/types/commentList.type';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import { createClient } from '@/utils/supabase/client';
import ButtonComponent from '@/components/common/ButtonComponent';
import AppPagination from '@/components/common/AppPagination';
import ConfirmModal from '@/components/modal/ConfirmModal';

const CommentList = ({ isEdit, userId, handleStartEdit, handleCancelEdit, editingId, postId }: CommentListProps) => {
  const pageSize = 10;
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { page, setCommentsUrl } = useCommentsUrlState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);

  const {
    data: comments,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery<CommentListResult>({
    queryKey: ['comments', postId, page],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const [{ data: commentData, error: commentDataError }, { data: statsData, error: statsError }] =
        await Promise.all([
          supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
            .range(from, to),
          supabase.from('post_stats').select('comment_count').eq('post_id', postId).maybeSingle(),
        ]);
      if (commentDataError) {
        throw new Error(commentDataError.message ?? '댓글 조회 실패');
      }

      if (statsError) {
        throw new Error(statsError.message ?? '댓글 수 조회 실패');
      }
      console.log(commentData);
      console.log(statsData);

      return {
        data: commentData ?? [],
        total: statsData?.comment_count ?? 0,
      };
    },
    enabled: !!postId,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const deleteCommentMutation = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['commentsByBook', userId] });
      queryClient.invalidateQueries({ queryKey: ['myComments', userId] });
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await toastMutationPromise(deleteCommentMutation.mutateAsync(id), '댓글 삭제중...');
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
        <Spinner />
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

  const totalPages = Math.max(1, Math.ceil((comments.total ?? 0) / pageSize));
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
          <ul className="space-y-3 py-6">
            {comments.data.map((comment) => {
              const { id, title, content, writer, created_at, user_id } = comment;
              const date = dayjs(created_at).locale('ko').format('YYYY-MM-DD HH:mm');
              const isMine = userId === user_id;

              return (
                <li
                  key={id}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md"
                >
                  {/* 헤더: 제목 + 날짜 */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-extrabold text-gray-900 sm:text-base">{title}</h3>
                      <p className="mt-1 text-[11px] text-gray-500">{date}</p>
                    </div>

                    {isMine ? (
                      <div className="flex shrink-0 gap-2">
                        <ButtonComponent
                          variant="outline"
                          size="xs"
                          label={isEdit && id === editingId ? '취소' : '수정'}
                          onClick={() => {
                            if (isEdit && editingId === id) {
                              handleCancelEdit();
                            } else {
                              handleStartEdit(comment);
                            }
                          }}
                        />
                        <ButtonComponent
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

                  {/* 본문: 내용 */}
                  <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 text-sm leading-6 text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{ __html: content || '' }}
                      className="prose prose-sm max-w-none break-words"
                    />
                  </div>

                  {/* 푸터: 작성자 */}
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-600">작성자: {writer}</p>

                    {isEdit && id === editingId ? (
                      <span className="text-[11px] font-semibold text-[#AF5858]">수정 중…</span>
                    ) : null}
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

      <AppPagination
        page={page}
        totalPages={totalPages}
        disabled={isFetching}
        onChange={(p) => setCommentsUrl({ page: p })}
      />
    </div>
  );
};

export default CommentList;
