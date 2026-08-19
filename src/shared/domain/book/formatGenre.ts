export const formatGenre = (genre?: string): string => {
  return genre?.split('/')[0] ?? '기타';
};
