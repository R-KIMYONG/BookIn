export const createRedirectUrl = (path: string, params: Record<string, string | undefined>) => {
  const url = new URL(path, 'http://example.com');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return `${url.pathname}${url.search}`;
};
