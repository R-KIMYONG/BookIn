export const rankingKeys = {
  all: ['ranking'] as const,
  topViewBooks: (limit = 5) => [...rankingKeys.all, 'view', limit] as const,
  topRankingBooks: () => [...rankingKeys.all, 'top'] as const,
};
