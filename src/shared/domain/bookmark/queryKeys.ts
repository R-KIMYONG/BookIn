export const bookmarkKeys = {
  all: ['bookmark'] as const,
  detail: (isbn: string) => ['bookmark', isbn] as const,
  memo: (userId: string, isbn: string) => ['bookmarkMemo', userId, isbn] as const,
  tags: {
    user: (userId: string | null) => ['bookmarkTags', 'user', userId] as const,
    detail: (userId: string | null, isbn: string) => ['bookmarkTags', 'detail', userId, isbn] as const,
  },
  list: ['bookmarkFetch'] as const,
  batch: (isbnList: string[], userId: string) => ['bookmark', 'user', userId, [...isbnList].sort().join(',')] as const,
};
