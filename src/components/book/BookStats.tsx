import { Eye, Heart, MessageCircleMore } from 'lucide-react';
import cn from '@/shared/utils/cn';
import { formatCount } from '@/shared/utils/formatCount';

type BookStatsSize = 'xs' | 'sm' | 'md' | 'lg';
type BookStatsProps = {
  viewCount: number;
  commentCount: number;
  likeCount?: number;
  size?: BookStatsSize;
  className?: string;
};

const SIZE_STYLES: Record<BookStatsSize, { text: string; icon: string; gap: string }> = {
  xs: { text: 'text-[10px]', icon: 'w-3 h-3', gap: 'gap-2' },
  sm: { text: 'text-[11px]', icon: 'w-3 h-3', gap: 'gap-2.5' },
  md: { text: 'text-xs', icon: 'w-3.5 h-3.5', gap: 'gap-3' },
  lg: { text: 'text-sm', icon: 'w-4 h-4', gap: 'gap-3.5' },
};

const BookStats = ({ viewCount, commentCount, likeCount, size = 'sm', className }: BookStatsProps) => {
  const s = SIZE_STYLES[size];
  return (
    <div className={cn('flex items-center text-gray-400 tabular-nums', s.gap, s.text, className)}>
      <span className="flex items-center gap-0.5" title={viewCount.toLocaleString()}>
        <Eye className={s.icon} />
        {formatCount(viewCount)}
      </span>
      {likeCount != null && (
        <span className="flex items-center gap-0.5" title={likeCount.toLocaleString()}>
          <Heart className={s.icon} />
          {formatCount(likeCount)}
        </span>
      )}
      <span className="flex items-center gap-0.5" title={commentCount.toLocaleString()}>
        <MessageCircleMore className={s.icon} />
        {formatCount(commentCount)}
      </span>
    </div>
  );
};

export default BookStats;
