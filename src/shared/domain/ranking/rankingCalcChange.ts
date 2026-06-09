import { RankChange } from './types';

type rankingCalcChangeType = {
  todayRank: number;
  yesterdayRank: number | undefined;
};
export const rankingCalcChange = ({ todayRank, yesterdayRank }: rankingCalcChangeType): RankChange => {
  if (yesterdayRank === undefined) return { type: 'new' };

  const diff = yesterdayRank - todayRank;

  if (diff > 0) return { type: 'up', diff };
  if (diff < 0) return { type: 'down', diff: -diff };
  return { type: 'same' };
};
