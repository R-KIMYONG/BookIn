'use client';

import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { CommentBook } from '@/types/myBooks.type';
import BooksGridContainer from './BooksGridContainer';
const CommentBooksList = ({ data }: { data: CommentBook[] }) => {
  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const isAboveFold = index < 5;
        const date = dayjs(book.last_commented_at).locale('ko').format('YYYY-MM-DD HH:mm');

        return (
          <li key={book.book_id}>
            <Link href={`/${book.isbn13}`}>
              <div className="h-60 relative overflow-hidden rounded-md">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 44vw, 200px"
                  priority={isAboveFold}
                />

                <div className="absolute inset-0 bg-black/40" />

                {/* <div className="absolute bottom-3 left-3 right-3 text-white"></div> */}
              </div>
            </Link>
            <div className="mt-2 h-14 px-2 text-xs">
              <p className="font-bold line-clamp-1 ">{book.title}</p>

              <div className="flex justify-between mt-1">
                <span>{book.last_commented_at ? date : ''}</span>
                <span>댓글 {book.comment_count}개</span>
              </div>
            </div>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default CommentBooksList;
