import 'server-only';
import { createClient } from '../../supabase/server';
import { cookies } from 'next/headers';
import { VK_COOKIE } from '@/shared/domain/detail/constants';
import { RECENTBOOK_MAX } from '@/shared/domain/recentbooks/constants';

export const getRecentBooks = async () => {
  const supabase = await createClient();
  

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const deviceKey = cookieStore.get(VK_COOKIE)?.value;

  let query = supabase
    .from('book_views')
    .select('isbn13, viewed_at, books(isbn13, title, author, thumbnail_url)')
    .order('viewed_at', { ascending: false })
    .eq('hidden', false)
    .limit(RECENTBOOK_MAX);

  if (user) query = query.eq('user_id', user.id);
  else if (deviceKey) query = query.eq('device_key', deviceKey);
  else return [];

  const { data, error } = await query;
  if (error) throw error;

  // JS 중복 제거 → 최대 50
  const seen = new Set<string>();
  const unique = [];
  for (const row of data ?? []) {
    if (seen.has(row.isbn13)) continue;
    seen.add(row.isbn13);
    unique.push(row);
  }
  return unique.slice(0, 50);
};
