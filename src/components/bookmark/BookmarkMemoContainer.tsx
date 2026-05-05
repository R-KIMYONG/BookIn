'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '@/hooks/useUser';
import BookmarkMemoModal from '@/components/modal/BookmarkMemoModal';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { Tag } from './BookmarkTagPicker';

type BookmarkMemoView = {
  bookmarkId: string;
  isbn13: string;
  memo: string | null;
  tags: Tag[];
  message?: string;
};

type SaveInput = { memo: string | null; tags: Tag[] };
const BookmarkMemoContainer = () => {
  const queryClient = useQueryClient();
  const { isOpen, isbn, close } = useBookmarkMemoUrlState();
  const { data: user, isLoading: userLoading } = useUser();
  const bookKey = (isbn ?? '').trim();
  const userId = user?.id ?? '';

  const memoKey = ['bookmarkMemo', userId, bookKey] as const;
  const {
    data: bookmarkData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<BookmarkMemoView>({
    queryKey: memoKey,
    queryFn: async () => {
      const response = await fetch(`/api/bookmark/memo?isbn13=${bookKey}`, { method: 'GET' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      return result;
    },
    enabled: isOpen && !!userId && !!bookKey && !userLoading,
    staleTime: 1000 * 60 * 5,
  });
  const mutation = useMutation<BookmarkMemoView, Error, SaveInput>({
    mutationFn: async ({ memo, tags }: SaveInput) => {
      const res = await fetch('/api/bookmark/memo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbn13: bookKey, memo, tags }),
      });

      const body = await res.json();

      if (!res.ok) throw new Error(body?.error ?? '메모 저장에 실패했습니다.');
      return {
        bookmarkId: String(body.bookmarkId ?? ''),
        isbn13: String(body.isbn13 ?? bookKey),
        memo: body.memo ?? null,
        tags: body.tags ?? [],
        message: body.message ?? '처리가 완료되었습니다.',
      };
    },
    onSuccess: (fresh) => {
      queryClient.setQueryData(memoKey, (prev: BookmarkMemoView | undefined) => {
        if (!prev) return prev;

        return { ...prev, memo: fresh.memo ?? null, tags: fresh.tags };
      });
      toast.dismiss(`bookmark-memo-suggest-${bookKey}`);
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['myBooks'] });
        queryClient.invalidateQueries({ queryKey: ['userTags', userId] });
      }
      queryClient.removeQueries({ queryKey: ['bookmarkMemo', userId, bookKey] });
      queryClient.invalidateQueries({ queryKey: ['detailBookmarkTags', userId, bookKey] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkFetch'] });
    },
  });

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
