import { Dispatch, SetStateAction } from 'react';
import { Tables } from './supabase';

export type CommentListProps = {
  isEdit: boolean;
  userId: string | null;
  handleStartEdit: (comment: Tables<'comments'>) => void;
  handleCancelEdit: () => void;
  editingId: string | null;
  bookId: string;
  initialPage: number;
};

export type CommentWithUser = Tables<'comments'> & {
  users?: {
    nickname: string;
  } | null;
};

export type CommentListResult = {
  data: CommentWithUser[];
  total: number;
};

export type TargetValue = {
  id?: string;
  content: string;
  created_at?: string;
};

export type CommentFormProps = {
  isEdit: boolean;
  targetValue: TargetValue;
  setTargetValue: Dispatch<SetStateAction<TargetValue>>;
  comment?: TargetValue | undefined;
  userId: string | undefined;
  handleCancelEdit: () => void;
  bookId: string;
};
