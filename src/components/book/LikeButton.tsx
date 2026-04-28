import { LikeCache, useLike } from '@/hooks/like/useLike';
import useUser from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ButtonComponent from '../common/ui/ButtonComponent';

const LikeButton = ({
  style,
  bookInfo,
}: {
  style?: string;
  bookInfo: { isbn13: string; title: string; cover: string; author: string };
}) => {
  const { toggle, isLoading } = useLike(bookInfo);
  const lockRef = useRef(false);
  const { data: user } = useUser();
  const handleClick = (e: React.MouseEvent) => {
    if (lockRef.current || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.warning('로그인 이후 좋아요할 수 있습니다.', {
        toastId: 'login-warning',
      });
      return;
    }
    lockRef.current = true;
    toggle(liked, {
      onSettled: () => {
        lockRef.current = false;
      },
    });
  };
  const queryKey = ['like', bookInfo.isbn13];
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
    <ButtonComponent
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
