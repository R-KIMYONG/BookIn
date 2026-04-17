import { LikeBook } from '@/types/myBooks.type';
import BooksGridContainer from './BooksGridContainer';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/book/LikeButton';

const LikeBooksList = ({ data }: { data: LikeBook[] }) => {
  return (
    <BooksGridContainer>
      {data.map((book,index) => {
        const isAboveFold = index<5
        const date = dayjs(book.created_at).locale('ko').format('YYYY-MM-DD HH:mm');
        const bookInfo = { isbn13: book.isbn13, cover: book.cover, title: book.title, author: book.author };
        return (
          <li key={book.book_id}>
            <Link href={`/${book.isbn13}`}>
              <div className="h-40 relative overflow-hidden rounded-md">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={isAboveFold}
                />

                <div className="absolute inset-0 bg-black/40" />
                <LikeButton bookInfo={bookInfo} />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold line-clamp-1 text-xs">{book.title}</p>

                  <div className="flex flex-col justify-between text-xs mt-1">
                    <span>{book.created_at ? date : ''}</span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default LikeBooksList;
