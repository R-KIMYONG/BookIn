'use client';
import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { toast } from 'react-toastify';
import Button from '../common/ui/Button';
import { BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import { ItemId } from '@/shared/domain/book/ids';
import BookmarkSavedToast from '../bookmark/BookmarkSavedToast';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { useBookmarkCache } from '@/hooks/bookmark/useBookmarkCache';

type BookmarkButtonProps = {
  style?: string;
  itemId: ItemId;
  scope: BookmarkMemoScope;
};

const BookmarkButton = ({ style, itemId, scope }: BookmarkButtonProps) => {
  const { toggle, isLoading } = useBookmark(itemId);
  const { open } = useBookmarkMemoUrlState();

  const { data } = useBookmarkCache(itemId);
  const bookmarked = data?.bookmarked ?? false;
  const handleClick = (e: React.MouseEvent) => {
    if (isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    toggle(bookmarked, {
      onSuccess: (result) => {
        const toastId = `bookmark-memo-suggest-${itemId}`;
        if (!result.bookmarked) {
          toast.dismiss(toastId);
          return;
        }
        if (scope !== 'home') return;

        toast.info(
          <BookmarkSavedToast
            onMemoClick={() => {
              toast.dismiss(toastId);
              open(itemId, scope);
            }}
          />,
          { toastId, autoClose: 5000, closeButton: true }
        );
      },
    });
  };
  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      aria-label="북마크"
      className={`${style} !bg-black/50 !backdrop-blur-sm !rounded-full !transition-all !duration-200 !ease-out
              hover:!bg-black/70 !p-3`}
      disabled={isLoading}
    >
      {bookmarked ? (
        <BookmarkCheck strokeWidth={2} className="w-3 h-3 text-yellow-400" />
      ) : (
        <Bookmark
          strokeWidth={2}
          className="w-3 h-3 text-white transition-colors duration-200 hover:!text-yellow-300"
        />
      )}
    </Button>
  );
};

export default BookmarkButton;
