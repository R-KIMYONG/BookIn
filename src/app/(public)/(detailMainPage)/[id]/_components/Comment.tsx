'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Tables } from '@/types/supabase';
import useUser from '@/hooks/useUser';
import { TargetValue } from '@/types/commentList.type';
import CommentList from './CommentList';
import dynamic from 'next/dynamic';
const CommentForm = dynamic(() => import('./CommentForm'), {
  ssr: false,
});
type Mode = 'create' | 'edit';
const Comment = ({ cover, book_title }: { cover: string; book_title: string }) => {
  const [mode, setMode] = useState<Mode>('create');
  const { data: user } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const { id: postId } = useParams<{ id: string }>();

  const formRef = useRef<HTMLDivElement | null>(null);
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
    setMode('edit');
    setTargetValue({
      id: comment.id,
      created_at: comment.created_at,
      title: comment.title ?? '',
      content: textContent,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMode('create');
    setTargetValue({
      id: '',
      title: '',
      content: '',
      created_at: '',
    });
  };

  useEffect(() => {
    if (mode === 'edit') {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [mode, editingId]);

  return (
    <div className="container mx-auto p-4">
      <CommentList
        isEdit={mode === 'edit'}
        userId={user?.id}
        handleStartEdit={handleStartEdit}
        handleCancelEdit={handleCancelEdit}
        editingId={editingId}
        postId={postId}
      />

      {user && (
        <div ref={formRef}>
          <CommentForm
            isEdit={mode === 'edit'}
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
      )}
    </div>
  );
};

export default Comment;
