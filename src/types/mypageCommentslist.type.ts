export type Mycommentlist = {
  data: {
    content: string;
    created_at: string;
    id: string;
    post_id: string;
    user_id: string;
    writer: string;
    cover: string;
    updated_at: string;
  }[];
  total: number;
};
