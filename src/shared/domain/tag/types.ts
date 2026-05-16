import { Dispatch, SetStateAction } from 'react';

export type Tag = { id?: string; name: string; color: string | null; slug: string };
export type BookmarkTagPickerProps = {
  value: Tag[]; // 선택된 태그
  onChange: Dispatch<SetStateAction<Tag[]>>;
  presets?: string[];
  maxTags?: number; // default 5
  maxLen?: number; // default 8
};

export type BookmarkMemoView = {
  bookmarkId: string;
  isbn13: string;
  memo: string | null;
  tags: Tag[];
  message?: string;
};

export type SaveInput = { memo: string | null; tags: Tag[] };
