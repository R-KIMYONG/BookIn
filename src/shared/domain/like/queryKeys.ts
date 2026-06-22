export const likeKeys = {
  all: ['like'] as const,
  detail: (isbn: string) => [likeKeys.all, isbn] as const,
  countBatch: (isbnList: string[]) => [likeKeys.all, 'count', [...isbnList].sort().join(',')] as const,
};
