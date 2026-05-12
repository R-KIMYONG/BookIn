import { LikeBook } from '@/shared/domain/mybooks/types';
import BooksGridContainer from './BooksGridContainer';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/book/LikeButton';

const LikeBooksList = ({ data }: { data: LikeBook[] }) => {
  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const isAboveFold = index < 5;
        const date = dayjs(book.created_at).locale('ko').format('YYYY-MM-DD HH:mm');
        const bookInfo = { isbn13: book.isbn13, cover: book.cover, title: book.title, author: book.author };
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
                <LikeButton bookInfo={bookInfo} style="absolute top-2 left-2" />
              </div>
            </Link>
            <div className="mt-2 h-14 px-2 text-xs">
              <p className="font-bold line-clamp-1">{book.title}</p>

              <div className="flex flex-col justify-between mt-1">
                <span>{book.created_at ? date : ''}</span>
              </div>
            </div>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default LikeBooksList;
