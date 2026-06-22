'use client';
import BookmarkButton from '@/components/book/BookmarkButton';
import LikeButton from '@/components/book/LikeButton';
import Button from '@/components/common/ui/Button';
import { useBookStats } from '@/hooks/book/useBookStats';
import { useMyStatus } from '@/hooks/book/useMyStatus';
import { useBookmarkCache } from '@/hooks/bookmark/useBookmarkCache';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { PencilLine } from 'lucide-react';
import { useMemo } from 'react';

type DetailActionsContainerProps = {
  bookInfo: {
    title: string;
    cover: string;
    author: string;
    isbn13: string;
    categoryId: number;
    categoryName: string;
  };
};

const DetailActionsContainer = ({ bookInfo }: DetailActionsContainerProps) => {
  const { open } = useBookmarkMemoUrlState();
  const bookKey = bookInfo.isbn13;
  const { data } = useBookmarkCache(bookKey);
  const memoExists = data?.memoExists ?? false;
  const bookmarked = data?.bookmarked ?? false;
  const ids = useMemo(() => (bookKey ? [bookKey] : []), [bookKey]);

  useBookStats(ids);
  useMyStatus(ids);

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
          leftIcon={<PencilLine className="h-3.5 w-3.5" />}
          label={memoExists ? '편집' : '메모'}
        />
      )}
    </div>
  );
};

export default DetailActionsContainer;
