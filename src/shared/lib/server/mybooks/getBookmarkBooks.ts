import 'server-only';
import { FILTER_DEFAULT, MyBooksFilter } from '@/shared/domain/mybooks/filter';
import { SearchField } from '@/shared/domain/mybooks/search';
import { MyBooksSort } from '@/shared/domain/mybooks/sort';
import { BookmarkBook, BookmarkRow, MyBooksResult } from '@/shared/domain/mybooks/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../../supabase/server';

const getBookmarkIdsBySearch = async ({
  supabase,
  userId,
  search,
  searchField,
}: {
  supabase: SupabaseClient;
  userId: string | undefined;
  search: string;
  searchField: SearchField;
}) => {
  const keyword = `%${search}%`;

  switch (searchField) {
    case 'memo': {
      const { data } = await supabase.from('bookmarks').select('book_id').eq('user_id', userId).ilike('memo', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    case 'title': {
      const { data } = await supabase
        .from('bookmarks')
        .select('book_id, books!inner(title)')
        .eq('user_id', userId)
        .ilike('books.title', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    case 'author': {
      const { data } = await supabase
        .from('bookmarks')
        .select('book_id, books!inner(author)')
        .eq('user_id', userId)
        .ilike('books.author', keyword);

      return data?.map((i) => i.book_id) ?? [];
    }

    default:
      return [];
  }
};

const getBookmarkTagIdsFilter = async ({
  supabase,
  userId,
  tagId,
}: {
  supabase: SupabaseClient;
  userId: string | undefined;
  tagId: string;
}) => {
  const { data } = await supabase
    .from('bookmark_tag_links')
    .select('bookmark:bookmarks!inner(book_id,user_id)')
    .eq('bookmark.user_id', userId)
    .eq('tag_id', tagId);

  const result =
    data
      ?.map((item) => {
        const bookmark = Array.isArray(item.bookmark) ? item.bookmark[0] : item.bookmark;
        return bookmark?.book_id;
      })
      .filter(Boolean) ?? [];

  return result;
};
export const getBookmarkBooks = async ({
  page,
  pageSize,
  sort,
  memoFilter = FILTER_DEFAULT,
  search,
  searchField,
  tagId,
}: {
  page: number;
  pageSize: number;
  sort: MyBooksSort;
  memoFilter?: MyBooksFilter;
  search?: string | null;
  searchField?: SearchField | null;
  tagId?: string | null;
}): Promise<MyBooksResult<BookmarkBook>> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let bookmarkQuery = supabase
    .from('bookmarks')
    .select(
      '*,books!inner(title,thumbnail_url,isbn13,author),tags:bookmark_tag_links(tag:bookmark_tags(id,name,slug,color))',
      { count: 'exact' }
    )
    .eq('user_id', userId);

  let filteredIds: Set<string> | null = null;

  if (tagId && tagId !== 'all') {
    const tagIds = await getBookmarkTagIdsFilter({ supabase, userId, tagId });

    if (tagIds.length === 0) return { data: [], total: 0 };

    filteredIds = new Set(tagIds);
  }

  if (search && searchField) {
    const searchIds = await getBookmarkIdsBySearch({ supabase, userId, search, searchField });

    if (searchIds.length === 0) return { data: [], total: 0 };

    if (filteredIds) {
      filteredIds = new Set(searchIds.filter((id) => filteredIds!.has(id)));
    } else {
      filteredIds = new Set(searchIds);
    }
  }

  if (filteredIds) {
    bookmarkQuery = bookmarkQuery.in('book_id', Array.from(filteredIds));
  }

  if (memoFilter === 'memo') {
    bookmarkQuery = bookmarkQuery.not('memo', 'is', null).neq('memo', '');
  } else if (memoFilter === 'no_memo') {
    bookmarkQuery = bookmarkQuery.or('memo.is.null,memo.eq.');
  }

  switch (sort) {
    case 'created_asc':
      bookmarkQuery = bookmarkQuery.order('created_at', { ascending: true });
      break;
    case 'created_desc':
      bookmarkQuery = bookmarkQuery.order('created_at', { ascending: false });
      break;
    case 'title_asc':
      bookmarkQuery = bookmarkQuery
        .order('books(title)', { ascending: true })
        .order('created_at', { ascending: false });
      break;
    case 'title_desc':
      bookmarkQuery = bookmarkQuery
        .order('books(title)', { ascending: false })
        .order('created_at', { ascending: false });
      break;
  }

  const { data, count, error } = await bookmarkQuery.range(from, to);
  if (error) throw error;
  const bookmarks = (data ?? []).map((item: BookmarkRow) => {
    return {
      book_id: item.book_id,
      created_at: item.created_at,
      cover: item.books.thumbnail_url ?? '/noImg.png',
      title: item.books.title,
      isbn13: item.books.isbn13,
      author: item.books.author,
      memo: item.memo ?? null,
      tags: (item.tags ?? []).map((l: any) => l.tag).filter(Boolean),
    };
  });
  return {
    data: bookmarks,
    total: count ?? 0,
  };
};
