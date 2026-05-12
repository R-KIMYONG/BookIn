import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import useUser from '@/hooks/auth/useUser';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from '../common/ui/Button';
import { FiEdit3 } from 'react-icons/fi';
import { BookmarkCache, BookmarkMemoScope } from '@/shared/domain/bookmark/types';
import { BookInfo } from '@/shared/types/bookInfo';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';

type BookmarkButtonProps = {
  style?: string;
  bookInfo: BookInfo;
  scope: BookmarkMemoScope;
};

const BookmarkButton = ({ style, bookInfo, scope }: BookmarkButtonProps) => {
  const { toggle, isLoading } = useBookmark(bookInfo);
  const { open } = useBookmarkMemoUrlState();
  const lockRef = useRef(false);
  const { data: user } = useUser();

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
    if (lockRef.current || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.warning('로그인 이후 북마크할 수 있습니다.', {
        toastId: 'login-warning',
      });
      return;
    }

    lockRef.current = true;
    toggle(bookmarked, {
      onSuccess: (result) => {
        const toastId = `bookmark-memo-suggest-${bookInfo.isbn13}`;
        if (!result.bookmarked) {
          toast.dismiss(toastId);
          return;
        }
        if (scope !== 'home') return;

        toast.info(
          ({ closeToast }) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">북마크에 저장했어요</p>
                <p className="text-xs text-gray-500 truncate">메모를 남기면 나중에 찾기 쉬워요.</p>
              </div>

              <Button
                className="underline font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeToast();
                  open(bookInfo.isbn13, scope);
                }}
                variant="secondary"
                size="xs"
                leftIcon={<FiEdit3 className="h-3.5 w-3.5" />}
                label="메모"
              />
            </div>
          ),

          { toastId, autoClose: 5000, closeButton: true }
        );
      },
      onSettled: () => {
        lockRef.current = false;
      },
    });
  };
  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="sm"
      className={`${style} !bg-black/50 !backdrop-blur-sm !rounded-full !transition-all !duration-200 !ease-out
              hover:!bg-black/70`}
      disabled={isLoading}
    >
      {bookmarked ? (
        <FaBookmark className="text-yellow-400 transition-colors duration-200 w-4 h-4" />
      ) : (
        <FaRegBookmark className="text-gray-300 hover:text-yellow-300 transition duration-200 w-4 h-4" />
      )}
    </Button>
  );
};

export default BookmarkButton;
