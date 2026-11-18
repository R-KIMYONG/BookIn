const AUTH_PATHS = ['/login', '/signup', '/terms'];

export const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}?`) || pathname.startsWith(`${p}/`));

export const toSafeRedirect = (path: string | null | undefined, fallback = '/') => {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return fallback;
  if (isAuthPath(path)) return fallback;
  return path;
};
