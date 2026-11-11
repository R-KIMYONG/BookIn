'use client';
import { Bookmark, BookmarkCheck, Heart, PencilLine } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useLike } from '@/hooks/like/useLike';
import { useLikeCache } from '@/hooks/like/useLikeCache';
import { useBookmark } from '@/hooks/bookmark/useBookmark';
import { useBookmarkCache } from '@/hooks/bookmark/useBookmarkCache';
import { useMyStatus } from '@/hooks/book/useMyStatus';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import { ItemId } from '@/shared/domain/book/ids';
import { formatCount } from '@/shared/utils/formatCount';
import cn from '@/shared/utils/cn';
import Button from '@/components/common/ui/Button';

const segment = '!rounded-none !gap-1.5 w-full';

const DetailActionBar = ({ itemId }: { itemId: ItemId }) => {
  const ids = useMemo(() => [itemId], [itemId]);
  useMyStatus(ids);

  const { toggle: toggleLike, isLoading: likeLoading } = useLike(itemId);
  const { data: like } = useLikeCache(itemId);
  const liked = like?.liked ?? false;
  const likeCount = like?.liked_count ?? 0;
  const lockRef = useRef(false); // 빠른 연타로 요청이 겹치지 않게 (LikeButton과 같은 방식)

  const { toggle: toggleBookmark, isLoading: bookmarkLoading } = useBookmark(itemId);
  const { data: bookmark } = useBookmarkCache(itemId);
  const bookmarked = bookmark?.bookmarked ?? false;
  const memoExists = bookmark?.memoExists ?? false;

  const { open } = useBookmarkMemoUrlState();

  const handleLike = () => {
    if (lockRef.current || likeLoading) return;
    lockRef.current = true;
    toggleLike({ onSettled: () => (lockRef.current = false) });
  };

  return (
    <div className="w-full space-y-2">
      <div className="grid grid-cols-2 divide-x divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={handleLike}
          disabled={likeLoading}
          aria-pressed={liked}
          className={segment}
          leftIcon={
            <Heart className={cn('h-4 w-4 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          }
        >
          <span className={liked ? 'font-medium text-red-500' : 'text-gray-600'}>좋아요</span>
          <span className="tabular-nums text-gray-400 ml-1">{formatCount(likeCount)}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => toggleBookmark(bookmarked)}
          disabled={bookmarkLoading}
          aria-pressed={bookmarked}
          className={segment}
          leftIcon={
            bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-main" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-400" />
            )
          }
        >
          <span className={bookmarked ? 'font-medium text-main' : 'text-gray-600'}>
            {bookmarked ? '저장됨' : '북마크'}
          </span>
        </Button>
      </div>

      {bookmarked && (
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={() => open(itemId, 'detail')}
          className="!bg-main/5 !text-main hover:!bg-main/10"
          leftIcon={<PencilLine className="h-3.5 w-3.5" />}
          label={memoExists ? '메모 편집' : '이 책에 메모 남기기'}
        />
      )}
    </div>
  );
};

export default DetailActionBar;
