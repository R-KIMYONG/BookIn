export const commentKeys = {
  all: ['comments'] as const,
  list: (bookId: string, page: number) => ['comments', bookId, page] as const,
  byUser: (userId: string) => ['commentsByBook', userId] as const,
};
