import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort } from '@/shared/domain/mybooks/sort';
import { LikeBook, LikeRow, MyBooksResult } from '@/shared/domain/mybooks/types';
import { SupabaseClient } from '@supabase/supabase-js';

const getLikeIdsBySearch = async ({
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
        .from('likes')
        .select('book_id,books!inner(title)')
        .eq('user_id', userId)
        .ilike('books.title', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }
    case 'author': {
      const { data } = await supabase
        .from('likes')
        .select('book_id, books!inner(author)')
        .eq('user_id', userId)
        .ilike('books.author', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    default:
      return [];
  }
};

export const getLikeBooks = async ({
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
  sort: MyBooksSort;
  search?: string | null;
  searchField?: SearchField | null;
}): Promise<MyBooksResult<LikeBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let likeQuery = supabase
    .from('likes')
    .select('*,books!inner(title,thumbnail_url,author,isbn13)', {
      count: 'exact',
    })
    .eq('user_id', userId);

  if (search && searchField) {
    const ids = await getLikeIdsBySearch({
      supabase,
      userId,
      search,
      searchField,
    });

    if (ids.length === 0) {
      return { data: [], total: 0 };
    }

    likeQuery = likeQuery.in('book_id', ids);
  }

  switch (sort) {
    case 'created_asc':
      likeQuery = likeQuery.order('created_at', { ascending: true });
      break;
    case 'created_desc':
      likeQuery = likeQuery.order('created_at', { ascending: false });
      break;
    case 'title_asc':
      likeQuery = likeQuery.order('books(title)', { ascending: true }).order('created_at', { ascending: false });
      break;
    case 'title_desc':
      likeQuery = likeQuery.order('books(title)', { ascending: false }).order('created_at', { ascending: false });
      break;
  }
  const { data, count, error } = await likeQuery.range(from, to);
  if (error) throw error;
  const likes = (data ?? []).map((item: LikeRow) => {
    const bookInfo = Array.isArray(item.books) ? item.books[0] : item.books;

    return {
      book_id: item.book_id ?? '',
      title: bookInfo.title ?? '',
      cover: bookInfo.thumbnail_url ?? '/noImg.png',
      created_at: item.created_at,
      isbn13: item.isbn13 ?? bookInfo.isbn,
      author: bookInfo.author ?? '',
    };
  });
  return {
    data: likes,
    total: count ?? 0,
  };
};
