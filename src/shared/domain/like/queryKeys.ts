export const likeKeys = {
  all: ['like'] as const,
  detail: (isbn: string) => ['like', isbn] as const,
  countBatch: (isbnList: string[]) => ['like', 'count', [...isbnList].sort().join(',')] as const,
};
