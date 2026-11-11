'use client';

import BookmarkMemoModal from '@/components/modal/BookmarkMemoModal';
import { useEffect } from 'react';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { useBookmarkMemo } from '@/hooks/bookmark/useBookmarkMemo';
import { useUpdateBookmarkMemo } from '@/hooks/bookmark/useUpdateBookmarkMemo';
import { useAuth } from '@/shared/context/AuthContext';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { ItemId } from '@/shared/domain/book/ids';

const BookmarkMemoContainer = () => {
  const { isOpen, itemId, close } = useBookmarkMemoUrlState();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  // 훅은 조건부로 부를 수 없어서, URL에 itemId가 없을 때는 0을 넣고 enabled로 막음 (isOpen이면 itemId가 반드시 있음)
  const safeItemId = itemId ?? (0 as ItemId);

  const { data: bookmarkData, isPending, isError, error, refetch } = useBookmarkMemo(safeItemId, userId, isOpen);

  const mutation = useUpdateBookmarkMemo(userId, safeItemId);

  useEffect(() => {
    if (!isOpen) return;

    if (!userId) {
      showToast(RESULT_CODE.AUTH_REQUIRED_LOGIN, { toastId: 'bookmark-memo-login' });
      close();
    }
  }, [isOpen, userId, close]);
  if (!isOpen || !itemId) return null;
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
