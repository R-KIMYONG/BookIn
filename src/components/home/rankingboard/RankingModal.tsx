'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { X, Trophy } from 'lucide-react';
import { RankedBook } from '@/shared/domain/ranking/types';
import { rankBadge } from '@/shared/domain/ranking/rankBadge';
import RankChangeBadge from './RankChangeBadge';
import BookStats from '@/components/book/BookStats';

type RankingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  books: RankedBook[];
};

const RankingModal = ({ isOpen, onClose, books }: RankingModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const top50 = books.slice(0, 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 본문 */}
      <div className="relative z-10 w-full max-w-md max-h-[80vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
        {/* 헤더 (고정) */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2 group">
            <span className="inline-block transition-transform duration-300 group-hover:scale-110">
              <Trophy className="w-4 h-4 text-[#af5858] origin-bottom  group-hover:animate-trophy-ring" />
            </span>
            종합 랭킹 TOP 50
          </h2>
          <button onClick={onClose} aria-label="닫기" className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 리스트 (스크롤) */}
        <ol className="flex-1 overflow-y-auto py-1">
          {top50.map((book, i) => {
            const rank = i + 1;
            return (
              <li key={book.isbn13}>
                <Link
                  href={`/${book.isbn13}?type=isbn13`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <RankChangeBadge change={book.change} />
                  <span
                    className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-lg text-xs font-extrabold tabular-nums ${rankBadge(rank)}`}
                  >
                    {rank}
                  </span>
                  <span className="flex-1 min-w-0 text-xs text-gray-800 truncate group-hover:text-[#af5858] transition-colors">
                    {book.title}
                  </span>
                  <BookStats
                    likeCount={book.like_count}
                    viewCount={book.view_count}
                    commentCount={book.comment_count}
                    size="sm"
                    className="shrink-0"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default RankingModal;
