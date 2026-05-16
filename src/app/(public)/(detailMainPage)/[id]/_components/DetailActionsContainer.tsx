'use client';
import BookmarkButton from '@/components/book/BookmarkButton';
import LikeButton from '@/components/book/LikeButton';
import Button from '@/components/common/ui/Button';
import { useFetchBookmark } from '@/hooks/bookmark/useFetchBookmark';
import { useFetchLikeCount } from '@/hooks/like/useFetchLikeCount';
import { useFetchLikes } from '@/hooks/like/useFetchLikes';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { BookmarkCache } from '@/shared/domain/bookmark/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FiEdit3 } from 'react-icons/fi';

const DetailActionsContainer = ({
  bookInfo,
  userId,
}: {
  bookInfo: { title: string; cover: string; author: string; isbn13: string; isbn: string };
  userId: string | null;
}) => {
  const { open } = useBookmarkMemoUrlState();
  const bookKey = useMemo(() => {
    return bookInfo.isbn13?.trim() || bookInfo.isbn?.trim() || '';
  }, [bookInfo.isbn13, bookInfo.isbn]);

  const queryKey = bookmarkKeys.detail(bookKey);

  const fallback: BookmarkCache = {
    isbn13: bookInfo.isbn13,
    bookmarked: false,
    memoExists: false,
  };

  const { data } = useQuery<BookmarkCache>({
    queryKey: queryKey,
    queryFn: async () => fallback,
    enabled: false,
  });
  const memoExists = data?.memoExists ?? false;
  const bookmarked = data?.bookmarked ?? false;
  const ids = useMemo(() => (bookKey ? [bookKey] : []), [bookKey]);

  useFetchLikes({ isbnList: ids, userId: userId });
  useFetchBookmark({ isbnList: ids, userId: userId });
  useFetchLikeCount(ids);

  const normalized = useMemo(
    () => ({
      ...bookInfo,
      isbn13: bookKey,
    }),
    [bookInfo, bookKey]
  );
  if (!bookKey) return null;
  return (
    <div className="flex items-center gap-2">
      <LikeButton bookInfo={normalized} />

      <BookmarkButton bookInfo={normalized} scope="detail" />
      {bookmarked && (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            open(normalized.isbn13, 'detail');
          }}
          variant="ghost"
          className={`${
            memoExists
              ? '!bg-emerald-500/70 !text-white hover:!bg-emerald-500/80 transition-all'
              : '!bg-black/50 !text-white hover:!bg-black/70 !transition-all !duration-200 !ease-out'
          }`}
          aria-label="북마크 메모 작성"
          leftIcon={<FiEdit3 className="h-3.5 w-3.5" />}
          label={memoExists ? '편집' : '메모'}
        />
      )}
    </div>
  );
};

export default DetailActionsContainer;
