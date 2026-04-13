import { LikeBook, MyBooksResult } from '@/types/myBooks.type';
import { SupabaseClient } from '@supabase/supabase-js';

type Row = {
  book_id: string;
  created_at: string;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
  }[];
};

export const getLikeBooks = async ({
  supabase,
  userId,
  page,
  pageSize,
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
  pageSize: number;
}): Promise<MyBooksResult<LikeBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('likes')
    .select('*,books(title,thumbnail_url)', {
      count: 'exact',
    })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  const likes = (data ?? []).map((item: Row) => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;

    return {
      book_id: item.book_id ?? '',
      title: bookInfo.title ?? '',
      cover: bookInfo.thumbnail_url ?? '/noImg.png',
      created_at: item.created_at,
      isbn13: bookInfo.isbn13,
    };
  });

  return {
    data: likes,
    total: count ?? 0,
  };
};
