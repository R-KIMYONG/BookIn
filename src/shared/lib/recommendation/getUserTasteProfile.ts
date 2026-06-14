import 'server-only';
import { createClient } from '../supabase/server';
import { BookMapType } from '@/shared/domain/recommend/types';

export const getUserTasteProfile = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const [{ data: likeList }, { data: bookmarkList }, { data: commentList }, { data: viewList }] = await Promise.all([
    supabase
      .from('likes')
      .select('book_id,books(isbn13,title,author)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('bookmarks')
      .select('book_id,books(isbn13,title,author)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('user_book_comments')
      .select('book_id,comment_count,books(isbn13,title,author)')
      .eq('user_id', userId)
      .order('comment_count', { ascending: false })
      .limit(25),
    supabase
      .from('book_views')
      .select('book_id,books(isbn13,title,author)')
      .eq('user_id', userId)
      .eq('hidden', false)
      .order('created_at', { ascending: false })
      .limit(25),
  ]);

  const booksMap = new Map<string, BookMapType>();

  for (const item of likeList ?? []) {
    const book = Array.isArray(item.books) ? item.books?.[0] : item.books;
    if (!book?.isbn13) continue;
    booksMap.set(book.isbn13, {
      isbn13: book.isbn13,
      title: book.title,
      author: book.author,
      liked: true,
      bookmarked: false,
      commented: false,
      viewed: false,
      score: 10,
    });
  }

  for (const item of bookmarkList ?? []) {
    const book = Array.isArray(item.books) ? item.books?.[0] : item.books;
    if (!book?.isbn13) continue;
    const existing = booksMap.get(book.isbn13);
    if (existing) {
      existing.bookmarked = true;
      existing.score += 8;
    } else {
      booksMap.set(book.isbn13, {
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        liked: false,
        bookmarked: true,
        commented: false,
        viewed: false,
        score: 8,
      });
    }
  }

  for (const item of commentList ?? []) {
    const book = Array.isArray(item.books) ? item.books?.[0] : item.books;
    if (!book?.isbn13) continue;
    const existing = booksMap.get(book.isbn13);

    if (existing) {
      existing.commented = true;
      existing.score += 6;
    } else {
      booksMap.set(book.isbn13, {
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        liked: false,
        bookmarked: false,
        commented: true,
        viewed: false,
        score: 6,
      });
    }
  }

  for (const item of viewList ?? []) {
    const book = Array.isArray(item.books) ? item.books?.[0] : item.books;
    if (!book?.isbn13) continue;
    const existing = booksMap.get(book.isbn13);

    if (existing) {
      existing.viewed = true;
      existing.score += 1;
    } else {
      booksMap.set(book.isbn13, {
        isbn13: book.isbn13,
        title: book.title,
        author: book.author,
        liked: false,
        bookmarked: false,
        commented: false,
        viewed: true,
        score: 1,
      });
    }
  }
  const books = Array.from(booksMap.values()).sort((a, b) => b.score - a.score);

  return books;
};
