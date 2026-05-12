export type MyBooksSort = 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc';

export const SORT_DEFAULT: MyBooksSort = 'created_desc';

export const SORT_LIST: MyBooksSort[] = ['created_desc', 'created_asc', 'title_asc', 'title_desc'];

export type SortByTab<T> = T extends 'bookmark' ? MyBooksSort : Extract<MyBooksSort, 'created_desc' | 'created_asc'>;

export const SORT_OPTIONS: { value: MyBooksSort; label: string }[] = [
  { value: 'created_desc', label: '최신순' },
  { value: 'created_asc', label: '오래된순' },
  { value: 'title_asc', label: '제목 오름차순' },
  { value: 'title_desc', label: '제목 내림차순' },
];
