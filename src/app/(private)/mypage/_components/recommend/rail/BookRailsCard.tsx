import BookLink from '@/components/book/BookLink';
import BookStats from '@/components/book/BookStats';
import { formatAuthor } from '@/shared/domain/book/formatAuthor';
import { toCoverSrc } from '@/shared/domain/book/toCoverSrc';
import { RailBookView } from '@/shared/domain/rails/types';
import Image from 'next/image';

type BookRailsCardProps = {
  book: RailBookView;
};

const BookRailsCard = ({ book }: BookRailsCardProps) => {
  const coverSrc = toCoverSrc(book.cover);
  const match = typeof book.similarity === 'number' ? Math.round(book.similarity * 100) : null;
  return (
    <BookLink itemId={book.itemId} adult={book.adult}>
      <article className="group w-36 shrink-0 sm:w-40">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
          <Image
            src={coverSrc}
            alt={`${book.title} 표지`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="160px"
          />

          {/* 일치도 배지 (similarity 있을 때만) */}
          {match !== null && (
            <span className="absolute left-2 top-2 rounded-full bg-indigo-600/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
              {match}% 일치
            </span>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </div>

        <div className="mt-2 px-0.5">
          <h5 className="line-clamp-1 text-sm font-semibold leading-5">{book.title}</h5>
          <p className="mt-0.5 truncate text-xs text-gray-500">{formatAuthor(book.author)}</p>
        </div>
        <div>
          <BookStats viewCount={book.stats?.view_count ?? 0} commentCount={book.stats?.comment_count ?? 0} />
        </div>
      </article>
    </BookLink>
  );
};

export default BookRailsCard;
