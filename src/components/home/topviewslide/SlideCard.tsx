import BookmarkButton from '@/components/book/BookmarkButton';
import BookStats from '@/components/book/BookStats';
import LikeButton from '@/components/book/LikeButton';
import { TopViewType } from '@/shared/domain/ranking/types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SlideCard = ({ book, rank, active }: { book: TopViewType; rank: number; active: boolean }) => {
  const coverSrc = book.thumbnail_url?.startsWith('http') ? book.thumbnail_url : '/images/noImg.png';

  const bookInfo = {
    isbn13: book.isbn13,
    title: book.title,
    cover: coverSrc,
    author: book.author,
    categoryId: book.categoryId,
    categoryName: book.categoryName,
  };
  return (
    <div className="relative w-full shrink-0 h-full overflow-hidden rounded-2xl">
      {/* 글라스 배경: 블러 표지 + 다크 틴트 (대비 보장) */}
      <div className="absolute inset-0">
        <Image
          src={coverSrc}
          alt=""
          fill
          aria-hidden
          sizes="(max-width:640px) 40vw, 450px"
          className="object-cover blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* 순위 워터마크 */}
      <span className="absolute top-1 right-4 text-[110px] sm:text-[140px] font-black leading-none text-white/10 select-none pointer-events-none">
        {rank}
      </span>

      {/* ===== 모바일 오버레이 ===== */}
      <div className="relative h-full sm:hidden text-white">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-[80%] aspect-[3/4]">
          <Image
            src={coverSrc}
            alt={book.title}
            fill
            priority={rank === 1}
            sizes="45vw"
            className="object-cover rounded-xl shadow-xl ring-1 ring-white/10"
          />
          <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between text-xs">
            <LikeButton bookInfo={bookInfo} />
            <BookmarkButton bookInfo={bookInfo} scope="home" />
          </div>
        </div>

        {/* 글라스 정보 패널 */}
        <div className="absolute right-0 inset-y-0 w-[58%] overflow-hidden border-l border-white/40 bg-white/15 backdrop-blur-xl backdrop-saturate-200 ring-1 ring-inset ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          {/* 상단 sheen  */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent" />
          {/* 대각 스페큘러 */}
          <div className="pointer-events-none absolute -top-1/3 -left-1/4 h-[160%] w-[75%] rotate-6 bg-gradient-to-br from-white/45 via-white/10 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-center gap-1.5 pl-7 pr-4">
            <span className="inline-flex items-center self-start rounded-full bg-white/90 text-[#af5858] text-[10px] font-bold px-2 py-0.5">
              조회수 {rank}위
            </span>
            <h3 className="text-lg font-extrabold line-clamp-2 leading-snug drop-shadow">{book.title}</h3>
            <p className="text-[11px] text-white/80 line-clamp-1">{book.author}</p>
            <BookStats viewCount={book.view_count} commentCount={book.comment_count} size="lg" className="text-white" />
            <Link
              href={`/${book.isbn13}?type=isbn13`}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              className="mt-1 self-start"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-white text-[#af5858] px-3 py-1 text-[11px] font-bold shadow-sm hover:bg-white/90 transition group">
                자세히 보기
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== 데스크탑 split ===== */}
      <div className="relative hidden sm:grid grid-cols-[42%_1fr] gap-5 lg:gap-8 p-6 h-full items-center text-white">
        <div className="flex justify-center items-center min-w-0 h-full">
          <div className="relative h-full aspect-[3/4] max-h-full max-w-full">
            <Image
              src={coverSrc}
              alt={book.title}
              fill
              priority={rank === 1}
              sizes="(max-width:1024px) 35vw, 450px"
              className="object-cover rounded-xl shadow-xl ring-1 ring-white/10"
            />
            <div className="absolute bottom-2 z-20 flex gap-1 items-center text-xs justify-between w-full px-4">
              <LikeButton bookInfo={bookInfo} />
              <BookmarkButton bookInfo={bookInfo} scope="home" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 min-w-0">
          <span className="inline-flex items-center gap-1 self-start rounded-full bg-white/90 text-[#af5858] text-xs font-bold px-2.5 py-1">
            조회수 {rank}위
          </span>
          <p className="text-md lg:text-lg font-bold line-clamp-2 leading-snug drop-shadow">{book.title}</p>
          <p className="text-sm text-white/80 line-clamp-1">{book.author}</p>
          <BookStats viewCount={book.view_count} commentCount={book.comment_count} size="lg" className="text-white" />
          <Link
            href={`/${book.isbn13}?type=isbn13`}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            className="mt-4 self-start"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-white text-[#af5858] px-3 py-2 text-xs font-bold shadow-sm hover:bg-white/90 transition group">
              자세히 보기
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;
