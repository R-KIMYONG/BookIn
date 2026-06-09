export const recentbookKeys = {
  all: ['recentBooks'] as const,
  list: () => [...recentbookKeys.all, 'list'] as const,
};
