import { ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { RankChange } from '@/shared/domain/ranking/types';

const RankChangeBadge = ({ change }: { change: RankChange }) => {
  const base = 'w-7 shrink-0 flex items-center justify-center';
  if (change.type === 'new') {
    return <span className={`${base} text-[10px] font-bold text-red-500 animate-pulse`}>NEW</span>;
  }
  if (change.type === 'up') {
    return (
      <span className={`${base} text-[11px] text-red-500 tabular-nums`}>
        <ChevronUp className="w-3 h-3" />
        {change.diff}
      </span>
    );
  }
  if (change.type === 'down') {
    return (
      <span className={`${base} text-[11px] text-blue-500 tabular-nums`}>
        <ChevronDown className="w-3 h-3" />
        {change.diff}
      </span>
    );
  }
  return (
    <span className={base}>
      <Minus className="w-3 h-3 text-gray-300" />
    </span>
  );
};

export default RankChangeBadge;
