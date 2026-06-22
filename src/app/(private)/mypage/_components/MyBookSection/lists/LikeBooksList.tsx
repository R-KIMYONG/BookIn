import { LikeBook } from '@/shared/domain/mybooks/types';
import BooksGridContainer from './BooksGridContainer';
import Link from 'next/link';
import Image from 'next/image';
import LikeButton from '@/components/book/LikeButton';
import { formatDateTime } from '@/shared/lib/date/formatDateTime';
import BookStats from '@/components/book/BookStats';

const LikeBooksList = ({ data }: { data: LikeBook[] }) => {
  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const isAboveFold = index < 6;
        const date = formatDateTime(book.created_at);
        const bookInfo = {
          isbn13: book.isbn13,
          cover: book.cover,
          title: book.title,
          author: book.author,
          categoryId: book.categoryId,
          categoryName: book.categoryName,
        };
        return (
          <li key={book.book_id}>
            <Link href={`/${book.isbn13}`}>
              <div className="h-60 relative overflow-hidden rounded-md group">
                <Image
                  src={book.cover?.trim() ? book.cover : '/images/noImg.png'}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 44vw, 200px"
                  unoptimized
                  priority={isAboveFold}
                />

                <div className="absolute inset-0 z-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                <LikeButton bookInfo={bookInfo} style="absolute top-2 left-2" />
              </div>
            </Link>
            <div className="mt-2 h-14 px-2 text-xs">
              <p className="font-bold line-clamp-1">{book.title}</p>
              <BookStats viewCount={book.total_view_count} commentCount={book.total_comment_count} />
              <span className="text-gray-400">{book.created_at ? date : ''}</span>
            </div>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default LikeBooksList;
