import 'server-only';

import { createClient } from '@/shared/lib/supabase/server';

export const getLikeCountsByIsbnList = async (isbnList: string[]) => {
  if (isbnList.length === 0) {
    return {};
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from('book_stats').select('isbn13, like_count').in('isbn13', isbnList);

  if (error) throw error;

  const countMap: Record<string, number> = {};

  for (const isbn of isbnList) {
    countMap[isbn] = 0;
  }

  for (const row of data ?? []) {
    const isbn = row.isbn13;

    if (!isbn) continue;

    countMap[isbn] = row.like_count ?? 0;
  }

  return countMap;
};
