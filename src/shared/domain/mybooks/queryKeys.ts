export const myBooksKeys = {
  all: ['myBooks'] as const,
  list: (params: {
    tab: string;
    userId: string;
    page: number;
    sort: string;
    filter?: string;
    search?: string;
    searchField?: string;
    tagId?: string;
  }) => ['myBooks', params] as const,
};
