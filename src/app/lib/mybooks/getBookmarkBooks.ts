import { BookmarkBook, MyBooksResult } from '@/types/myBooks.type';
import { BookmarkFilter, BookmarkSort } from '@/types/useMypageUrlState.type';
import { SupabaseClient } from '@supabase/supabase-js';

type Row = {
  book_id: string;
  created_at: string;
  memo: string | null;
  books: {
    title: string;
    thumbnail_url: string;
    isbn13: string;
    author: string;
  };
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
      color: string | null;
    };
  }[];
};

export const getBookmarkBooks = async ({
  supabase,
  userId,
  page,
  pageSize,
  sort,
  memoFilter = 'all',
}: {
  supabase: SupabaseClient;
  userId: string;
  page: number;
  pageSize: number;
  sort: BookmarkSort;
  memoFilter: BookmarkFilter;
}): Promise<MyBooksResult<BookmarkBook>> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let bookmarkQuery = supabase
    .from('bookmarks')
    .select(
      '*,books(title,thumbnail_url,isbn13,author),tags:bookmark_tag_links(tag:bookmark_tags(id,name,slug,color))',
      { count: 'exact' }
    )
    .eq('user_id', userId);

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

  const bookmarks = (data ?? []).map((item: Row) => {
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
