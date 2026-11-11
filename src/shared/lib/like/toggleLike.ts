import { ItemId } from '@/shared/domain/book/ids';
import { LikeResponseUserType } from '@/shared/domain/like/types';

// 책 정보는 보내지 않음: 서버가 itemId로 YES24에서 확인해 저장
export const toggleLike = async (itemId: ItemId): Promise<LikeResponseUserType & { liked_count?: number }> => {
  const res = await fetch('/api/like/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemId }),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.error ?? '좋아요 실패');

  return result;
};
