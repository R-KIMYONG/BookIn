export const hasMemo = (memo?: string | null) => {
  if (!memo) return false;

  const text = memo
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '')
    .trim();

  return text.length > 0;
};
