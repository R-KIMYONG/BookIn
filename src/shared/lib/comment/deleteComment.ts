export const deleteComment = async (id: string) => {
  const response = await fetch(`/api/comment/?id=${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? '댓글 삭제 실패');

  return result;
};
