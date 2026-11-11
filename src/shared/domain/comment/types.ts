import { Tables } from '@/shared/types/supabase';

export type CommentWithUser = Tables<'comments'> & {
  users: Pick<Tables<'users'>, 'nickname' | 'avatar'> | null;
};

export type CommentListResult = {
  data: CommentWithUser[];
  total: number;
};

export type SubmitItem = Pick<Tables<'comments'>, 'content' | 'book_id'>;
export type UpdateSubmitItem = SubmitItem & Pick<Tables<'comments'>, 'id'>;
