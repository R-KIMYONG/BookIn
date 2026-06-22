import { useLike } from '@/hooks/like/useLike';
import { useRef } from 'react';
import Button from '../common/ui/Button';
import { BookInfo } from '@/shared/types/bookInfo';
import cn from '@/shared/utils/cn';
import { Heart } from 'lucide-react';
import { useLikeCache } from '@/hooks/like/useLikeCache';
import { formatCount } from '@/shared/utils/formatCount';

type LikeButtonProps = {
  style?: string;
  bookInfo: BookInfo;
};

const LikeButton = ({ style, bookInfo }: LikeButtonProps) => {
  const { toggle, isLoading } = useLike(bookInfo);
  const lockRef = useRef(false);
  const handleClick = (e: React.MouseEvent) => {
    if (lockRef.current || isLoading) return;

    e.preventDefault();
    e.stopPropagation();

    lockRef.current = true;
    toggle({
      onSettled: () => {
        lockRef.current = false;
      },
    });
  };
  const { data } = useLikeCache(bookInfo.isbn13);
  const liked = data?.liked ?? false;
  const count = data?.liked_count ?? 0;
  return (
    <Button
      onClick={handleClick}
      leftIcon={
        <Heart
          className={cn(
            'h-4 w-4 transition-colors duration-200',
            liked ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'
          )}
        />
      }
      label={formatCount(count)}
      disabled={isLoading}
      className={`${style}  !bg-black/50 !backdrop-blur-sm text-white !rounded-full transition-all duration-200 ease-out hover:!bg-black/70`}
      variant="ghost"
      size="sm"
    />
  );
};

export default LikeButton;
