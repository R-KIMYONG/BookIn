export const recommendationsKey = {
  all: ['recommendations'] as const,
  list: () => [...recommendationsKey.all, 'list'] as const,
};
