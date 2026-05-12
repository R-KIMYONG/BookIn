'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CommentList from '../CommentList';
import dynamic from 'next/dynamic';
import Button from '@/components/common/ui/Button';
import useCurrentUrl from '@/hooks/common/useCurrentUrl';
import { CommentWithUser } from '@/shared/domain/comment/types';
import { Mode } from 'fs';
import { TargetValue } from './types';
const CommentForm = dynamic(() => import('../CommentForm'), {
  ssr: false,
});

type CommentProps = {
  bookId: string;
  initialPage: number;
  initialUserId: string | null;
};
const Comment = ({ bookId, initialUserId, initialPage }: CommentProps) => {
  const [mode, setMode] = useState<Mode>('create');

  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  const currentUrl = useCurrentUrl();

  const formRef = useRef<HTMLDivElement | null>(null);
  const [targetValue, setTargetValue] = useState<TargetValue>({
    id: '',
    content: '',
    created_at: '',
  });

  const handleStartEdit = (comment: CommentWithUser) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(comment.content ?? '', 'text/html');
    const textContent = doc.body.textContent || '';

    setEditingId(comment.id);
    setMode('edit');
    setTargetValue({
      id: comment.id,
      created_at: comment.created_at,
      content: textContent,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMode('create');
    setTargetValue({
      id: '',
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
        userId={initialUserId}
        handleStartEdit={handleStartEdit}
        handleCancelEdit={handleCancelEdit}
        editingId={editingId}
        bookId={bookId}
        initialPage={initialPage}
      />

      <div ref={formRef}>
        {initialUserId ? (
          <CommentForm
            isEdit={mode === 'edit'}
            targetValue={targetValue}
            setTargetValue={setTargetValue}
            handleCancelEdit={handleCancelEdit}
            userId={initialUserId}
            bookId={bookId}
          />
        ) : (
          <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-8 text-center">
            <p className="text-sm font-semibold text-gray-700">댓글 작성은 로그인 후 이용할 수 있습니다.</p>
            <p className="mt-1 text-xs text-gray-500">회원가입 후 로그인하면 댓글을 남길 수 있어요.</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                label="로그인"
                onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(currentUrl)}`)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                label="회원가입"
                onClick={() => router.push(`/signup?redirectTo=${encodeURIComponent(currentUrl)}`)}
              />
              <Button type="button" variant="secondary" size="sm" label="홈으로" onClick={() => router.push('/')} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
