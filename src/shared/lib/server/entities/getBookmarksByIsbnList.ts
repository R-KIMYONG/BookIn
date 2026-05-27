import 'server-only';

import { createClient } from '@/shared/lib/supabase/server';
import { BookmarkInfo } from '@/shared/domain/bookmark/types';



export const getBookmarksByIsbnList = async (isbnList: string[]): Promise<Record<string, BookmarkInfo>> => {
  if (isbnList.length === 0) {
    return {};
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {};
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .select('isbn13,memo')
    .eq('user_id', user.id)
    .in('isbn13', isbnList);

  if (error) {
    throw error;
  }
  const map: Record<string, BookmarkInfo> = {};

  isbnList.forEach((isbn) => {
    map[isbn] = { bookmarked: false, memoExists: false };
  });

  data?.forEach((row) => {
    map[row.isbn13] = {
      bookmarked: true,
      memoExists: !!row.memo,
    };
  });

  return map;
};
