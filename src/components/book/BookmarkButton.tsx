import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { toast } from 'react-toastify';
import Button from '../common/ui/Button';
import { BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import { BookInfo } from '@/shared/types/bookInfo';
import BookmarkSavedToast from '../bookmark/BookmarkSavedToast';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkCache } from '@/hooks/bookmark/useBookmarkCache';

type BookmarkButtonProps = {
  style?: string;
  bookInfo: BookInfo;
  scope: BookmarkMemoScope;
};

const BookmarkButton = ({ style, bookInfo, scope }: BookmarkButtonProps) => {
  const { toggle, isLoading } = useBookmark(bookInfo);
  const { open } = useBookmarkMemoUrlState();

  const { data } = useBookmarkCache(bookInfo.isbn13);
  const bookmarked = data?.bookmarked ?? false;
  const handleClick = (e: React.MouseEvent) => {
    if (isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    toggle(bookmarked, {
      onSuccess: (result) => {
        const toastId = `bookmark-memo-suggest-${bookInfo.isbn13}`;
        if (!result.bookmarked) {
          toast.dismiss(toastId);
          return;
        }
        if (scope !== 'home') return;

        toast.info(
          <BookmarkSavedToast
            onMemoClick={() => {
              toast.dismiss(toastId);
              open(bookInfo.isbn13, scope);
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
              hover:!bg-black/70`}
      disabled={isLoading}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-yellow-400" />
      ) : (
        <Bookmark className="w-4 h-4 text-gray-300 transition-colors duration-200 hover:text-yellow-300" />
      )}
    </Button>
  );
};

export default BookmarkButton;
