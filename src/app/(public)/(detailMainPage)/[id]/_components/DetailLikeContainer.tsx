'use client';
import LikeButton from '@/components/book/LikeButton';
import { useFetchLikes } from '@/hooks/useFetchLikes';
import { useMemo } from 'react';

const DetailLikeContainer = ({
  bookInfo,
}: {
  bookInfo: { title: string; cover: string; author: string; isbn13: string; isbn: string };
}) => {
  const bookKey = useMemo(() => {
    return bookInfo.isbn13?.trim() || bookInfo.isbn?.trim() || '';
  }, [bookInfo.isbn13, bookInfo.isbn]);
  useFetchLikes(bookKey ? [bookKey] : []);

  const normalizeBookInfo = {
    ...bookInfo,
    isbn13: bookKey,
  };

  return <LikeButton bookInfo={normalizeBookInfo} />;
};

export default DetailLikeContainer;
