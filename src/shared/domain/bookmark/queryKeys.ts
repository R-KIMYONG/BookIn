export const bookmarkKeys = {
  all: ['bookmark'] as const,
  detail: (isbn: string) => ['bookmark', isbn] as const,
  memo: (userId: string, isbn: string) => ['bookmarkMemo', userId, isbn] as const,
  tags: {
    user: () => ['bookmarkTags', 'user'] as const,
    detail: (userId: string | null, isbn: string) => ['bookmarkTags', 'detail', userId, isbn] as const,
  },
};
