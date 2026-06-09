import BookmarkButton from '@/components/book/BookmarkButton';
import LikeButton from '@/components/book/LikeButton';
import { TopViewType } from '@/shared/domain/ranking/types';
import { Eye, Heart, MessageCircleMore } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SlideCard = ({ book, rank, active }: { book: TopViewType; rank: number; active: boolean }) => {
  const coverSrc = book.thumbnail_url?.startsWith('http') ? book.thumbnail_url : '/images/noImg.png';
  return (
    <div className="relative w-full shrink-0 h-full overflow-hidden rounded-2xl">
      {/* 표지에서 추출한 블러 배경 */}
      <div className="absolute inset-0">
        <Image
          src={coverSrc}
          alt=""
          fill
          aria-hidden
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 450px"
          className="object-cover blur-2xl scale-110 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/70" />
      </div>

      {/* 거대한 순위 숫자 (배경 워터마크) */}
      <span className="absolute top-1 right-4 text-[110px] sm:text-[140px] font-black leading-none text-[#af5858]/10 select-none pointer-events-none">
        {rank}
      </span>

      {/* 본문 */}
      <div className="relative grid grid-cols-[50%_1fr] lg:grid-cols-[42%_1fr] gap-3 sm:gap-5 lg:gap-8 p-4 sm:p-6 h-full items-center">
        {/* 표지 */}
        <div className="flex justify-center items-center min-w-0 h-full">
          <div className="relative h-full aspect-[3/4] max-h-full max-w-full">
            <Image
              src={coverSrc}
              alt={book.title}
              fill
              priority={rank === 1}
              sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 450px"
              className="object-cover rounded-xl shadow-xl ring-1 ring-black/5"
            />
            <div className="absolute bottom-2 z-20 flex gap-1 items-center text-xs text-white justify-between w-full px-4">
              <LikeButton
                bookInfo={{
                  isbn13: book.isbn13,
                  title: book.title,
                  cover: coverSrc,
                  author: book.author,
                }}
              />

              <BookmarkButton
                bookInfo={{
                  isbn13: book.isbn13,
                  title: book.title,
                  cover: coverSrc,
                  author: book.author,
                }}
                scope="home"
              />
            </div>
          </div>
        </div>

        {/* 정보 */}
        <div className="flex flex-col justify-center gap-2 sm:gap-3 min-w-0">
          {/* 순위 배지 */}
          <span className="inline-flex items-center gap-1 self-start rounded-full bg-[#af5858] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1">
            조회수 {rank}위
          </span>

          <h3 className="text-sm sm:text-2xl lg:text-3xl font-bold line-clamp-2 leading-snug">{book.title}</h3>
          <p className="text-[11px] sm:text-sm text-gray-600 line-clamp-1">{book.author}</p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="tabular-nums">{book.view_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="tabular-nums">{book.like_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <MessageCircleMore className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="tabular-nums">{book.comment_count.toLocaleString()}</span>
            </div>
          </div>

          <Link
            href={`/${book.isbn13}?type=isbn13`}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            className="mt-2 sm:mt-4 self-start"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-[#af5858] text-white px-3 py-1 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-medium shadow-sm hover:bg-[#8f4646] transition">
              자세히 보기 →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
