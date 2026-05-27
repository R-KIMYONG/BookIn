import 'server-only';

import { createClient } from '@/shared/lib/supabase/server';

export const getLikesByIsbnList = async (isbnList: string[]): Promise<Record<string, boolean>> => {
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

  const { data, error } = await supabase.from('likes').select('isbn13').eq('user_id', user.id).in('isbn13', isbnList);

  if (error) {
    throw error;
  }

  const map: Record<string, boolean> = {};

  isbnList.forEach((isbn) => {
    map[isbn] = false;
  });

  data?.forEach((item) => {
    map[item.isbn13] = true;
  });

  return map;
};
