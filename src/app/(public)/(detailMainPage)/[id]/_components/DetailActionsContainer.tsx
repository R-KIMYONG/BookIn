'use client';
import BookmarkButton from '@/components/book/BookmarkButton';
import LikeButton from '@/components/book/LikeButton';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { BookmarkCache } from '@/hooks/bookmark/useBookmark';
import { useFetchBookmark } from '@/hooks/bookmark/useFetchBookmark';
import { useFetchLikes } from '@/hooks/like/useFetchLikes';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { FiEdit3 } from 'react-icons/fi';

const DetailActionsContainer = ({
  bookInfo,
}: {
  bookInfo: { title: string; cover: string; author: string; isbn13: string; isbn: string };
}) => {
  const { open } = useBookmarkMemoUrlState();

  const bookKey = useMemo(() => {
    return bookInfo.isbn13?.trim() || bookInfo.isbn?.trim() || '';
  }, [bookInfo.isbn13, bookInfo.isbn]);

  const queryKey = ['bookmark', bookKey];

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

  useFetchLikes(ids);

  useFetchBookmark(ids);

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
        <ButtonComponent
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
          label={memoExists? '편집':'메모'}
        />
      )}
    </div>
  );
};

export default DetailActionsContainer;
