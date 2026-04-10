export type Mycommentlist = {
  data: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    book_id: string;
    books: {
      title: string;
      thumbnail_url: string | null;
    } | null;
  }[];
  total: number;
};
