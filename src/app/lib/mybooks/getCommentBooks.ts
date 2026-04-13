import { CommentBook, MyBooksResult } from '@/types/myBooks.type';
import { SupabaseClient } from '@supabase/supabase-js';

type Row = {
  book_id: string;
  comment_count: number;
  last_commented_at: string;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
  }[];
};

export const getCommentBooks = async ({
  supabase,
  userId,
  page,
  pageSize,
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
  pageSize: number;
}): Promise<MyBooksResult<CommentBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('user_book_comments')
    .select('book_id,comment_count,last_commented_at, books(title,thumbnail_url,isbn13)', {
      count: 'exact',
    })
    .eq('user_id', userId)
    .order('last_commented_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  const commentBooks = (data ?? []).map((item: Row) => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;

    return {
      book_id: item.book_id,
      title: bookInfo?.title ?? '',
      cover: bookInfo?.thumbnail_url ?? '/noImg.png',
      comment_count: item.comment_count,
      last_commented_at: item.last_commented_at,
      isbn13: bookInfo.isbn13 ?? '',
    };
  });

  return {
    data: commentBooks,
    total: count ?? 0,
  };
};
