'use client';
import Link from 'next/link';
import { ChevronRight, Heart, MessageCircleMore, Trophy } from 'lucide-react';
import { RankedBook } from '@/shared/domain/ranking/types';
import RankingModal from './RankingModal';
import Button from '@/components/common/ui/Button';
import { rankBadge } from '@/shared/domain/ranking/rankBadge';
import RankChangeBadge from './RankChangeBadge';
import { useState } from 'react';

const RankingBoard = ({ books }: { books: RankedBook[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const top10 = books.slice(0, 10);

  if (top10.length === 0) return null;

  return (
    <aside className="w-full rounded-2xl bg-white shadow-md ring-1 ring-black/5 flex flex-col overflow-hidden self-start">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-[#af5858]/5 to-transparent">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#af5858]" />
          종합 랭킹
        </h3>
        <span className="text-[11px] text-gray-400 cursor-help" title="조회수·좋아요·댓글을 합산한 화제성 점수 순">
          화제성 순 ⓘ
        </span>
      </div>

      {/* 리스트 */}
      <ol className="py-1">
        {top10.map((book, i) => {
          const rank = i + 1;
          const isTop3 = rank <= 3;
          return (
            <li key={book.isbn13}>
              <Link
                href={`/${book.isbn13}?type=isbn13`}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors group"
              >
                <RankChangeBadge change={book.change} />
                {/* 순위 */}
                <span
                  className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-lg text-xs font-extrabold tabular-nums ${rankBadge(rank)}`}
                >
                  {rank}
                </span>

                <span
                  className={`flex-1 min-w-0 text-xs truncate group-hover:text-[#af5858] transition-colors ${
                    isTop3 ? 'font-semibold text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {book.title}
                </span>

                <span className="shrink-0 w-12 flex items-center gap-2 text-[11px] text-gray-400 tabular-nums">
                  <span className="flex items-center gap-0.5">
                    <Heart className="w-3 h-3" />
                    {book.like_count}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircleMore className="w-3 h-3" />
                    {book.comment_count}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="secondary"
        size="xs"
        label="전체 순위 더보기"
        rightIcon={<ChevronRight className="w-4 h-4" />}
      />
      <RankingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} books={books} />
    </aside>
  );
};

export default RankingBoard;
