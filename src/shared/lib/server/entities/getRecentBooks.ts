import 'server-only';
import { createAdminClient } from '../../supabase/admin';
import { cookies } from 'next/headers';
import { VK_COOKIE } from '@/shared/domain/detail/constants';
import { RECENTBOOK_MAX } from '@/shared/domain/recentbooks/constants';
import { RecentBook } from '@/shared/domain/recentbooks/types';
import { ItemId } from '@/shared/domain/book/ids';
import { getCurrentUser } from '../../auth/getCurrentUser';

export const getRecentBooks = async (): Promise<RecentBook[]> => {
  const user = await getCurrentUser();

  const cookieStore = await cookies();
  const deviceKey = cookieStore.get(VK_COOKIE)?.value;
  if (!user && !deviceKey) return [];

  // book_views RLS는 로그인 본인만 읽기 허용 → 비로그인(device_key)도 조회하려면 관리자 클라이언트 필요.
  // 대상은 서버가 확인한 user/쿠키로만 한정
  let query = createAdminClient()
    .from('book_views')
    .select('item_id, viewed_at, books(item_id, title, author, thumbnail_url)')
    .order('viewed_at', { ascending: false })
    .eq('hidden', false)
    .limit(RECENTBOOK_MAX);

  query = user ? query.eq('user_id', user.id) : query.eq('device_key', deviceKey!);

  const { data, error } = await query;
  if (error) throw error;

  // JS 중복 제거 (같은 책을 다른 날 다시 보면 행이 여러 개)
  const seen = new Set<number>();
  const unique: RecentBook[] = [];
  for (const row of data ?? []) {
    if (seen.has(row.item_id)) continue;
    seen.add(row.item_id);
    unique.push({
      item_id: row.item_id as ItemId,
      viewed_at: row.viewed_at,
      books: row.books && { ...row.books, item_id: row.books.item_id as ItemId },
    });
  }
  return unique;
};
