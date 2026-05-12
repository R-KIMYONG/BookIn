import { Tables } from '@/shared/types/supabase';

export type CommentWithUser = Tables<'comments'> & {
  users?: {
    nickname: string;
  } | null;
};

export type CommentListResult = {
  data: CommentWithUser[];
  total: number;
};

export type SubmitItem = Pick<Tables<'comments'>, 'user_id' | 'content' | 'book_id' | 'updated_at'>;
export type UpdateSubmitItem = SubmitItem & Pick<Tables<'comments'>, 'id'>;
