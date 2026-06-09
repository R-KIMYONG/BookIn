export type RecentBook = {
  isbn13: string;
  viewed_at: string;
  books: {
    isbn13: string;
    title: string;
    author: string | null;
    thumbnail_url: string | null;
  } | null;
};
