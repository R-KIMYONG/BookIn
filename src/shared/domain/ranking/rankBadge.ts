export const rankBadge = (rank: number): string => {
  if (rank === 1) return 'bg-yellow-400 text-white';
  if (rank === 2) return 'bg-slate-300 text-white';
  if (rank === 3) return 'bg-orange-400 text-white';
  return 'text-gray-400';
};
