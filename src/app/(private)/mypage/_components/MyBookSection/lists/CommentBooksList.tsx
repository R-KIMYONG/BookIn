import Image from 'next/image';
import Link from 'next/link';
import { CommentBook } from '@/shared/domain/mybooks/types';
import BooksGridContainer from './BooksGridContainer';
import { formatDateTime } from '@/shared/lib/date/formatDateTime';
import BookStats from '@/components/book/BookStats';
import { formatCount } from '@/shared/utils/formatCount';
const CommentBooksList = ({ data }: { data: CommentBook[] }) => {
  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const date = formatDateTime(book.last_commented_at);
        const isAboveFold = index < 6;
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
              </div>
            </Link>
            <div className="mt-2 h-14 px-2 text-xs">
              <p className="font-bold line-clamp-1 ">{book.title}</p>
              <BookStats
                viewCount={book.total_view_count}
                likeCount={book.total_like_count}
                commentCount={book.total_comment_count}
              />
              <div className="flex justify-between text-gray-400">
                <span>{book.last_commented_at ? date : ''}</span>
                <span>내 댓글 {formatCount(book.comment_count)}개</span>
              </div>
            </div>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default CommentBooksList;
