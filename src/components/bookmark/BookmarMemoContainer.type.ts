import { Tag } from './BookmarkTagPicker';

export type BookmarkMemoView = {
  bookmarkId: string;
  isbn13: string;
  memo: string | null;
  tags: Tag[];
  message?: string;
};

export type SaveInput = { memo: string | null; tags: Tag[] };
