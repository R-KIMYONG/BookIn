export type MyBookBase = {
  book_id: string;
  title: string;
  cover: string;
  isbn13: string;
};

export type CommentBook = MyBookBase & {
  comment_count: number;
  last_commented_at: string;
};

export type LikeBook = MyBookBase & {
  created_at: string;
  author: string;
};

export type BookmarkBook = MyBookBase & {
  created_at: string;
  author: string;
  memo: string | null;
  tags: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  }[];
};

export type MyBooksResult<T> = {
  data: T[];
  total: number;
};
