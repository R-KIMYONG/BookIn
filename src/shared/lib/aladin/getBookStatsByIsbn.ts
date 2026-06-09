import 'server-only';
import { createClient } from '@/shared/lib/supabase/server';

export const getBookStatsByIsbn = async (isbnList: string[]) => {
  if (isbnList.length === 0) return {};
  const supabase = await createClient();
  const { data } = await supabase.from('book_stats').select('isbn13,view_count, comment_count').in('isbn13', isbnList);

  const map: Record<string, { view_count: number; comment_count: number }> = {};
  for (const isbn of isbnList) map[isbn] = { view_count: 0, comment_count: 0 };
  for (const row of data ?? []) {
    if (row.isbn13)
      map[row.isbn13] = {
        view_count: row.view_count ?? 0,
        comment_count: row.comment_count ?? 0,
      };
  }
  return map;
};
