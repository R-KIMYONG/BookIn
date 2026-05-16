import { COLOR_TOKENS } from './constants';

export const getTagColorClass = (key: string | null) =>
  COLOR_TOKENS.find((c) => c.key === key)?.className ?? 'bg-gray-100 text-gray-700 ring-gray-200';
