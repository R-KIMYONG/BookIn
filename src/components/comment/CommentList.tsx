'use client';

import useCommentQuery from '@/hooks/useCommentQuery';
import { Tables } from '@/types/supabase';
import { Spinner } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import { TargetValue } from './Comment';
import CommentPagination from './Pagination';
import ButtonComponent from '../common/ButtonComponent';

interface Props {
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setTargetValue: Dispatch<SetStateAction<TargetValue>>;
  user: any;
}

const CommentList = ({ isEdit, setIsEdit, setTargetValue, user }: Props) => {
  const queryClient = useQueryClient();

  const { id: postId } = useParams<{ id: string }>();
  const { comments, isPending } = useCommentQuery({ postId });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const offset: number = (page - 1) * pageSize;
  const commentsToDisplay = Array.isArray(comments) ? comments.slice(offset, offset + pageSize) : [];
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (comment: Tables<'comments'>) => {
    setEditingId(comment.id);
    setIsEdit(false);
    setIsEdit(!isEdit);
    const { id, title, content, created_at }: any = comment;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const textContent = doc.body.textContent || '';

    setTargetValue((prev) => ({
      ...prev,
      id,
      created_at,
      title: isEdit ? '' : title,
      content: isEdit ? '' : textContent,
    }));
  };

  const deleteComment = async (id: string) => {
    const response = await fetch(`/api/comment/?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const deleteErrorText = await response.text();
      throw new Error(deleteErrorText);
    }
    return response.json();
  };

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData(['comments', postId]);

      queryClient.setQueryData(['comments', postId], (old: any) => old.filter((comment: any) => comment.id !== id));

      return { previousComments };
    },
    onError: (error, id, context) => {
      queryClient.setQueryData(['comments', postId], context?.previousComments);
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('삭제 완료');
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm('삭제시 복구가 어렵습니다. 정말 삭제하시겠습니까?')) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  if (!comments)
    return (
      <div className="w-[100%] flex justify-center">
        <Spinner />
      </div>
    );
  if (isPending)
    return (
      <div className="w-[100%] flex justify-center">
        <Spinner />
      </div>
    );

  const totalPages: number = comments && Array.isArray(comments) ? Math.ceil(comments.length / pageSize) : 1;
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">코멘트</h3>
          <p className="mt-1 text-xs text-gray-500">
            총 <span className="font-bold text-[#AF5858]">{comments.length}</span>개
          </p>
        </div>
      </div>

      {commentsToDisplay?.length === 0 ? (
        <div>No comments yet</div>
      ) : (
        <ul className="border-y-2 border-black">
          {commentsToDisplay?.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-gray-700">아직 댓글이 없어요</p>
              <p className="mt-1 text-xs text-gray-500">첫 댓글을 남겨보세요.</p>
            </div>
          ) : (
            <ul className="space-y-3 py-6">
              {commentsToDisplay.map((comment) => {
                const { id, title, content, writer, created_at, user_id } = comment;
                const date = dayjs(created_at).locale('ko').format('YYYY-MM-DD HH:mm');
                const isMine = user?.id === user_id;

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
                            onClick={() => handleEdit(comment)}
                          />
                          <ButtonComponent variant="danger" size="xs" label="삭제" onClick={() => handleDelete(id)} />
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
        </ul>
      )}

      <CommentPagination page={page} totalComments={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default CommentList;
