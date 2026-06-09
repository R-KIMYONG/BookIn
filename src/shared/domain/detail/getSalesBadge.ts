import { Crown, Flame, ThumbsUp, type LucideIcon } from 'lucide-react';

type SalesBadge = { label: string; Icon: LucideIcon; tone: 'red' | 'amber' | 'blue' };

export const getSalesBadge = (salesPoint: number): SalesBadge | null => {
  if (salesPoint >= 100000) return { label: '베스트셀러', Icon: Crown, tone: 'red' };
  if (salesPoint >= 10000) return { label: '인기', Icon: Flame, tone: 'amber' };
  if (salesPoint >= 1000) return { label: '꾸준한 판매', Icon: ThumbsUp, tone: 'blue' };
  return null;
};

export const toneClass: Record<SalesBadge['tone'], string> = {
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-600',
};
