'use client';
import { createClient } from '@/utils/supabase/client';
import { Spinner } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { Tables } from '@/types/supabase';
import useUser from '@/hooks/useUser';
import { TargetValue } from '@/types/commentList.type';

export type NowUser = {
  nickname: string;
  user_id: string;
};


const Comment = ({ cover, book_title }: { cover: string; book_title: string }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { data: user, isPending } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { id: postId } = useParams<{ id: string }>();
  const [targetValue, setTargetValue] = useState<TargetValue>({
    id: '',
    title: '',
    content: '',
    created_at: '',
  });

  const handleStartEdit = (comment: Tables<'comments'>) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(comment.content ?? '', 'text/html');
    const textContent = doc.body.textContent || '';

    setEditingId(comment.id);
    setIsEdit(true);
    setTargetValue({
      id: comment.id,
      created_at: comment.created_at,
      title: comment.title ?? '',
      content: textContent,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsEdit(false);
    setTargetValue({
      id: '',
      title: '',
      content: '',
      created_at: '',
    });
  };
  if (isPending) {
    return (
      <div className="w-[100%] flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <CommentList
        isEdit={isEdit}
        userId={user?.id}
        handleStartEdit={handleStartEdit}
        handleCancelEdit={handleCancelEdit}
        editingId={editingId}
        postId={postId}
      />
      <CommentForm
        isEdit={isEdit}
        targetValue={targetValue}
        setTargetValue={setTargetValue}
        handleCancelEdit={handleCancelEdit}
        book_title={book_title}
        cover={cover}
        userId={user?.id}
        userNickName={user?.user_metadata?.nickname ?? ''}
        postId={postId}
      />
    </div>
  );
};

export default Comment;
