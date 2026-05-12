export const likeKeys = {
  all: ['like'] as const,
  detail: (isbn: string) => ['like', isbn] as const,
  countBatch: (isbnList: string[]) => ['like', 'count', [...isbnList].sort().join(',')] as const,
  userBatch: (userId: string, isbnList: string[]) => ['like', 'user', userId, [...isbnList].sort().join(',')] as const,
};
