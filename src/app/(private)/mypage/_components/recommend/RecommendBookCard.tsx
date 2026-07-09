import Link from 'next/link';
import Image from 'next/image';
import { RecommendBook } from '@/shared/domain/recommend/types';

const RecommendBookCard = ({ book }: { book: RecommendBook }) => {
  const coverSrc = book.thumbnail_url?.startsWith('http') ? book.thumbnail_url : '/images/noImg.png';
  return (
    <Link href={`/${book.isbn13}?type=isbn13`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg ring-1 ring-black/5 bg-gray-50">
        <Image
          src={coverSrc}
          alt={book.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <p className="mt-2 text-sm font-semibold leading-5 line-clamp-1 group-hover:text-[#af5858] transition-colors">
        {book.title}
      </p>
      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{book.author}</p>
    </Link>
  );
};

export default RecommendBookCard;
