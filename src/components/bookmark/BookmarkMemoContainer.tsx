'use client';

import useUser from '@/hooks/auth/useUser';
import BookmarkMemoModal from '@/components/modal/BookmarkMemoModal';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { useBookmarkMemo } from '@/hooks/bookmark/useBookmarkMemo';
import { useUpdateBookmarkMemo } from '@/hooks/bookmark/useUpdateBookmarkMemo';

const BookmarkMemoContainer = () => {
  const { isOpen, isbn, close } = useBookmarkMemoUrlState();
  const { data: user, isLoading: userLoading } = useUser();
  const bookKey = (isbn ?? '').trim();
  const userId = user?.id ?? '';

  const { data: bookmarkData, isPending, isError, error, refetch } = useBookmarkMemo(bookKey, userId, isOpen);

  const mutation = useUpdateBookmarkMemo(userId, bookKey);

  useEffect(() => {
    if (!isOpen) return;

    if (userLoading) return;

    if (!userId) {
      toast.warning('로그인이 필요합니다.', { toastId: 'bookmark-memo-login' });
      close();
    }
  }, [isOpen, userLoading, userId, close]);
  if (!isOpen || !bookKey) return null;
  const initialMemoHtml = bookmarkData?.memo ?? null;
  const initialTags = bookmarkData?.tags ?? [];
  const loadError = isError ? (error instanceof Error ? error.message : '메모를 불러오지 못했습니다.') : null;

  return (
    <BookmarkMemoModal
      isOpen={isOpen}
      onClose={close}
      initialMemoHtml={initialMemoHtml}
      initialTags={initialTags}
      onSave={async ({ memo, tags }) => {
        await toastMutationPromise(mutation.mutateAsync({ memo, tags }), { pending: '메모 저장중...' });
      }}
      isSaving={mutation.isPending}
      isLoadingMemo={isPending}
      loadError={loadError}
      onRefetch={refetch}
    />
  );
};

export default BookmarkMemoContainer;
