import { CommentListResult } from '@/shared/domain/comment/types';

type getCommentListProps = {
  bookId: string;
  page: number;
};
export const getCommentList = async ({ bookId, page }: getCommentListProps): Promise<CommentListResult> => {
  const response = await fetch(`/api/comment?bookId=${bookId}&page=${page}`);

  if (!response.ok) {
    throw new Error('댓글 리스트 조회 실패');
  }
  const data = await response.json();
  return data;
};
