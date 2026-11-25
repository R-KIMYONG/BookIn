export const rankBadge = (rank: number): string => {
  if (rank === 1) return 'bg-yellow-700 text-white';
  if (rank === 2) return 'bg-slate-500 text-white';
  if (rank === 3) return 'bg-orange-700 text-white';
  return 'text-gray-500';
};
