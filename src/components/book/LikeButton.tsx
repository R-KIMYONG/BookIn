import { useLike } from '@/hooks/like/useLike';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Button from '../common/ui/Button';
import { LikeCache } from '@/shared/domain/like/types';
import { BookInfo } from '@/shared/types/bookInfo';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { useAuth } from '@/shared/context/AuthContext';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';

type LikeButtonProps = {
  style?: string;
  bookInfo: BookInfo;
};

const LikeButton = ({ style, bookInfo }: LikeButtonProps) => {
  const { toggle, isLoading } = useLike(bookInfo);
  const lockRef = useRef(false);
  const { user } = useAuth();
  const handleClick = (e: React.MouseEvent) => {
    if (lockRef.current || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast(RESULT_CODE.AUTH_REQUIRED_LOGIN);
      return;
    }
    lockRef.current = true;
    toggle({
      onSettled: () => {
        lockRef.current = false;
      },
    });
  };
  const queryKey = likeKeys.detail(bookInfo.isbn13);
  const fallback: LikeCache = {
    isbn13: bookInfo.isbn13,
    liked: false,
    liked_count: 0,
  };
  const { data } = useQuery<LikeCache>({
    queryKey: queryKey,
    queryFn: async () => fallback,
    enabled: false,
  });
  const liked = data?.liked ?? false;
  const count = data?.liked_count ?? 0;
  return (
    <Button
      onClick={handleClick}
      leftIcon={
        liked ? (
          <FaHeart className="text-red-500 transition-colors duration-200 w-4 h-4" />
        ) : (
          <FaRegHeart className="text-gray-300 hover:text-red-400 transition duration-200 w-4 h-4" />
        )
      }
      label={count}
      disabled={isLoading}
      className={`${style}  !bg-black/50 !backdrop-blur-sm text-white !rounded-full transition-all duration-200 ease-out hover:!bg-black/70`}
      variant="ghost"
      size="sm"
    />
  );
};

export default LikeButton;
