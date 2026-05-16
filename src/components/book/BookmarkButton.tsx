import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { useQuery } from '@tanstack/react-query';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../common/ui/Button';
import { BookmarkCache, BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import { BookInfo } from '@/shared/types/bookInfo';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';
import { useAuth } from '@/shared/context/AuthContext';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import BookmarkSavedToast from '../bookmark/BookmarkSavedToast';

type BookmarkButtonProps = {
  style?: string;
  bookInfo: BookInfo;
  scope: BookmarkMemoScope;
};

const BookmarkButton = ({ style, bookInfo, scope }: BookmarkButtonProps) => {
  const { toggle, isLoading } = useBookmark(bookInfo);
  const { open } = useBookmarkMemoUrlState();
  const { user } = useAuth();

  const queryKey = bookmarkKeys.detail(bookInfo.isbn13);
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
  const bookmarked = data?.bookmarked ?? false;
  const handleClick = (e: React.MouseEvent) => {
    if (isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast(RESULT_CODE.AUTH_REQUIRED_LOGIN, { toastId: 'login-warning' });
      return;
    }

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
        <FaBookmark className="text-yellow-400 transition-colors duration-200 w-4 h-4" />
      ) : (
        <FaRegBookmark className="text-gray-300 hover:text-yellow-300 transition-colors duration-200 w-4 h-4" />
      )}
    </Button>
  );
};

export default BookmarkButton;
