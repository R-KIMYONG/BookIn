import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DiggingBook } from '@/shared/domain/digging/types';
import { makeHref } from '@/shared/domain/book/makeHref';

const DiggingBookCard = ({ book, rank }: { book: DiggingBook; rank: number }) => {
  const cover = book.cover?.startsWith('http') ? book.cover : '/images/noImg.png';
  const genre = book.categoryName ?? '';
  const href = makeHref(book.itemId);
  const card = (
    <article className="w-full group flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-main/30 hover:shadow-md">
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
        <Image
          src={cover}
          alt={`${book.title} 표지`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="80px"
        />
        <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-main text-[11px] font-bold text-white shadow">
          {rank}
        </span>
      </div>

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        {genre && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-main/10 px-2 py-0.5 text-[11px] font-medium text-main">
            <Sparkles className="h-3 w-3" /> {genre}
          </span>
        )}
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{book.title}</h4>
        <p className="truncate text-xs text-gray-500">{book.author}</p>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block w-72">
      {card}
    </Link>
  ) : (
    <div className="cursor-not-allowed opacity-60" title="상세 페이지가 없어요">
      {card}
    </div>
  );
};

export default DiggingBookCard;
