import { CommentBook, MyBooksResult } from '@/types/myBooks.type';
import { MyBooksSort, SearchField } from '@/types/useMypageUrlState.type';
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

const getCommentIdsBySearch = async ({
  supabase,
  userId,
  search,
  searchField,
}: {
  supabase: SupabaseClient;
  userId: string;
  search: string;
  searchField: SearchField;
}) => {
  const keyword = `%${search}%`;

  switch (searchField) {
    case 'title': {
      const { data } = await supabase
        .from('user_book_comments')
        .select('book_id, books!inner(title)')
        .eq('user_id', userId)
        .ilike('books.title', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    case 'author': {
      const { data } = await supabase
        .from('user_book_comments')
        .select('book_id, books!inner(author)')
        .eq('user_id', userId)
        .ilike('books.author', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    case 'content': {
      const { data } = await supabase
        .from('comments')
        .select('book_id')
        .eq('user_id', userId)
        .ilike('content', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    default:
      return [];
  }
};

export const getCommentBooks = async ({
  supabase,
  userId,
  page,
  pageSize,
  sort,
  search,
  searchField,
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
  pageSize: number;
  sort: MyBooksSort | undefined;
  search?: string | null;
  searchField?: SearchField | null;
}): Promise<MyBooksResult<CommentBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let commentQuery = supabase
    .from('user_book_comments')
    .select('book_id,comment_count,last_commented_at, books(title,thumbnail_url,isbn13)', {
      count: 'exact',
    })
    .eq('user_id', userId);

  if (search && searchField) {
    const ids = await getCommentIdsBySearch({
      supabase,
      userId,
      search,
      searchField,
    });
    if (ids.length === 0) {
      return { data: [], total: 0 };
    }

    commentQuery = commentQuery.in('book_id', ids);
  }

  switch (sort) {
    case 'created_asc':
      commentQuery = commentQuery.order('last_commented_at', { ascending: true });
      break;
    case 'created_desc':
      commentQuery = commentQuery.order('last_commented_at', { ascending: false });
      break;
    case 'title_asc':
      commentQuery = commentQuery.order('books(title)', { ascending: true }).order('created_at', { ascending: false });
      break;
    case 'title_desc':
      commentQuery = commentQuery.order('books(title)', { ascending: false }).order('created_at', { ascending: false });
      break;
  }

  const { data, count, error } = await commentQuery.range(from, to);

  if (error) throw error;

  const commentBooks = (data ?? []).map((item: Row) => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;

    return {
      book_id: item.book_id,
      title: bookInfo?.title ?? '',
      cover: bookInfo?.thumbnail_url ?? '/images/noImg.png',
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
