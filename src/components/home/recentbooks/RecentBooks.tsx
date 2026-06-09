'use client';
import { useRecentBooks } from '@/hooks/recentbooks/useRecentBooks';
import { RecentBook } from '@/shared/domain/recentbooks/types';
import { BookOpen, Clock } from 'lucide-react';
import RecentBookCard from './RecentBookCard';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/ui/Button';
import { useState } from 'react';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useDeleteRecentBooks } from '@/hooks/recentbooks/useDeleteRecentBook';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';

const RecentBooks = () => {
  const { data = [] } = useRecentBooks();
  const [isOpen, setIsOpen] = useState(false);

  const deleteRecentBook = useDeleteRecentBooks();

  const handleDelete = async (isbn13?: string) => {
    await toastMutationPromise(
      deleteRecentBook.mutateAsync(isbn13, {
        onSuccess: () => {
          if (!isbn13) setIsOpen(false);
        },
      }),
      {
        pending: '최근 본 책 삭제중...',
      }
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#af5858]" />
          최근 본 책
        </h2>
        {data.length > 0 && <Button variant="danger" label="전체 삭제" size="xs" onClick={() => setIsOpen(true)} />}
      </div>
      {/* 가로 스크롤 */}
      {data.length === 0 ? (
        <EmptyState
          className="py-10 bg-gray-50 rounded-2xl"
          icon={<BookOpen className="w-10 h-10 text-gray-300" />}
          title="아직 본 책이 없어요"
          description="관심 있는 책을 둘러보세요"
          showButton={false}
        />
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
          {data.map((item: RecentBook) =>
            item.books ? (
              <div key={item.isbn13} className="snap-start shrink-0 w-[120px] sm:w-[140px]">
                <RecentBookCard book={item.books} created_at={item.viewed_at} onDelete={handleDelete} />
              </div>
            ) : null
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        title="최근 본책 전체 삭제"
        message="최근 본 책 기록을 모두 삭제합니다"
        confirmColor="danger"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDelete}
        onClose={() => setIsOpen(false)}
      />
    </section>
  );
};

export default RecentBooks;
