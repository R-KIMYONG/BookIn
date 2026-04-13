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
};

export type BookmarkBook = MyBookBase & {
  created_at: string;
};

export type MyBooksResult<T> = {
  data: T[];
  total: number;
};
