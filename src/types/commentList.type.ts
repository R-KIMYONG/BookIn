import { Dispatch, SetStateAction } from 'react';
import { Tables } from './supabase';

export type CommentListProps = {
  isEdit: boolean;
  userId: string | undefined;
  handleStartEdit: (comment: Tables<'comments'>) => void;
  handleCancelEdit: () => void;
  editingId: string | null;
  postId: string;
};

export type CommentListResult = {
  data: Tables<'comments'>[];
  total: number;
};

export type TargetValue = {
  id?: string;
  title: string | undefined;
  content: string | undefined;
  created_at?: string;
};

export type CommentFormProps = {
  isEdit: boolean;
  targetValue: TargetValue;
  setTargetValue: Dispatch<SetStateAction<TargetValue>>;
  comment?: TargetValue | undefined;
  userId: string | undefined;
  cover: string;
  book_title: string;
  userNickName: string;
  handleCancelEdit: () => void;
  postId: string;
};
