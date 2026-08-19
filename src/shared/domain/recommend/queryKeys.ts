export const recommendationsKey = {
  all: ['recommendations'] as const,
  list: () => [...recommendationsKey.all, 'list'] as const,
  taste: () => [...recommendationsKey.all, 'taste'] as const,
  rail: () => [...recommendationsKey.all, 'rail'] as const,
  tasteReport: () => [...recommendationsKey.all, 'tasteReport'] as const,
  tasteAnalysis: () => [...recommendationsKey.all, 'tasteAnalysis'] as const,
};
