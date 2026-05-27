import { ValueOf } from '@/shared/types/common';

export const FILTER = {
  ALL: 'all',
  MEMO: 'memo',
  NO_MEMO: 'no_memo',
} as const;

export type MyBooksFilter = ValueOf<typeof FILTER>;

export const FILTER_DEFAULT: MyBooksFilter = 'all';

export const FILTER_LIST = Object.values(FILTER);

export const FILTER_OPTIONS = [
  { value: FILTER.ALL, label: '전체' },
  { value: FILTER.MEMO, label: '메모 있음' },
  { value: FILTER.NO_MEMO, label: '메모 없음' },
];
