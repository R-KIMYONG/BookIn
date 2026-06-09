export const formatAuthor = (author?: string): string => {
  if (!author) return '저자 정보 없음';

  const parts = author.split(',');
  const first = parts[0]
    .trim()
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
  const restCount = parts.length - 1;

  return restCount > 0 ? `${first} 외 ${restCount}명` : first;
};
