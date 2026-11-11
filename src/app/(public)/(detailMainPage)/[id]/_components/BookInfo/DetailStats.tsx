'use client';
import { Eye, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useBookStats } from '@/hooks/book/useBookStats';
import { ItemId } from '@/shared/domain/book/ids';
import { formatCount } from '@/shared/utils/formatCount';

const DetailStats = ({ itemId }: { itemId: ItemId }) => {
  const ids = useMemo(() => [itemId], [itemId]);
  const { data } = useBookStats(ids); // 서버에서 미리 채워 둔 캐시 → 첫 화면부터 숫자가 있음
  const stats = data?.[itemId];

  const views = stats?.view_count ?? 0;
  const comments = stats?.comment_count ?? 0;

  return (
    <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400">
      <span className="inline-flex items-center gap-1" title="조회수">
        <Eye className="h-3.5 w-3.5 text-gray-400" aria-hidden />
        <span className="tabular-nums">{formatCount(views)}</span>
        <span className="sr-only">회 조회</span>
      </span>

      <span className="h-3 w-px bg-gray-200" aria-hidden />

      <a
        href="#comments"
        className="inline-flex items-center gap-1 rounded transition-colors hover:text-main"
        title="댓글로 이동"
      >
        <MessageCircle className="h-3.5 w-3.5 text-gray-400" aria-hidden />
        <span className="tabular-nums">{formatCount(comments)}</span>
        <span className="sr-only">개의 댓글, 댓글로 이동</span>
      </a>
    </div>
  );
};

export default DetailStats;
