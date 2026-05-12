export const getBookmarkMemo = async (isbn13: string) => {
  const res = await fetch(`/api/bookmark/memo?isbn13=${isbn13}`, {
    method: 'GET',
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message ?? '메모 조회 실패');
  }
  return result;
};
