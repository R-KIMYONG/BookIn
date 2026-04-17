import { BookmarkBook, MyBooksResult } from '@/types/myBooks.type';
import { SupabaseClient } from '@supabase/supabase-js';

type Row = {
  book_id: string;
  created_at: string;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
    author: string;
  }[];
};

export const getBookmarkBooks = async ({
  supabase,
  userId,
  page,
  pageSize,
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
  pageSize: number;
}): Promise<MyBooksResult<BookmarkBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('bookmarks')
    .select('*,books(title,thumbnail_url,isbn13,author)', {
      count: 'exact',
    })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  const bookmarks = (data ?? []).map((item: Row) => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;

    return {
      book_id: item.book_id,
      title: bookInfo.title ?? '',
      cover: bookInfo.thumbnail_url ?? '/noImg.png',
      isbn13: bookInfo.isbn13,
      created_at: item.created_at,
      author: bookInfo.author,
    };
  });

  return {
    data: bookmarks,
    total: count ?? 0,
  };
};
