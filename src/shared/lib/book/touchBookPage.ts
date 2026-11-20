import 'server-only';
import { createAdminClient } from '@/shared/lib/supabase/admin';

// 상세 페이지 내용(댓글)이 바뀌었음을 books.page_modified_at에 기록 -> sitemap lastmod
// books는 유저 권한(RLS)으로 수정할 수 없어 admin 클라이언트 사용
// 실패해도 댓글 처리 자체는 성공이어야 하므로 던지지 않고 로그만 남김
export const touchBookPage = async (bookId: string, at = new Date().toISOString()) => {
  const { error } = await createAdminClient().from('books').update({ page_modified_at: at }).eq('id', bookId);
  if (error) console.error('page_modified_at 갱신 실패:', error);
};
