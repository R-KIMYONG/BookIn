import 'server-only';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort } from '@/shared/domain/mybooks/sort';
import { CommentBook, CommentRow, MyBooksResult } from '@/shared/domain/mybooks/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../../supabase/server';
import { getCurrentUser } from '../../auth/getCurrentUser';
import { parseItemId } from '@/shared/domain/book/ids';

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
  page,
  pageSize,
  sort,
  search,
  searchField,
}: {
  page: number;
  pageSize: number;
  sort: MyBooksSort;
  search?: string | null;
  searchField?: SearchField | null;
}): Promise<MyBooksResult<CommentBook>> => {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const userId = user?.id;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  if (!userId) return { data: [], total: 0 };

  let commentQuery = supabase
    .from('user_book_comments')
    .select(
      'comment_count,last_commented_at,books!inner(item_id,title,thumbnail_url,book_stats(view_count,like_count,comment_count))',
      {
        count: 'exact',
      }
    )
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

  const commentBooks = (data ?? []).flatMap((item: CommentRow): CommentBook[] => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;
    const itemId = parseItemId(bookInfo?.item_id);
    if (!itemId) return [];

    const stats = Array.isArray(bookInfo?.book_stats) ? bookInfo?.book_stats[0] : bookInfo?.book_stats;

    return [
      {
        itemId,
        title: bookInfo?.title ?? '',
        cover: bookInfo?.thumbnail_url ?? '/images/noImg.png',
        comment_count: item.comment_count,
        last_commented_at: item.last_commented_at,
        total_like_count: stats?.like_count ?? 0,
        total_view_count: stats?.view_count ?? 0,
        total_comment_count: stats?.comment_count ?? 0,
      },
    ];
  });

  return {
    data: commentBooks,
    total: count ?? 0, //페이지네이션에서 총몇페이지 구분하기위함
  };
};
