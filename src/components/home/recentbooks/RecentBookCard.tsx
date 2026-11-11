import Link from 'next/link';
import Image from 'next/image';
import { formatRelativeTime } from '@/shared/lib/date/formatRelativeTime';
import Button from '@/components/common/ui/Button';
import { X } from 'lucide-react';
import { ItemId } from '@/shared/domain/book/ids';
import { makeHref } from '@/shared/domain/book/makeHref';

type RecentBookCardProps = {
  book: {
    item_id: ItemId;
    title: string;
    author: string | null;
    thumbnail_url: string | null;
  };
  created_at: string;
  onDelete: (itemId?: ItemId) => void;
};

const RecentBookCard = ({ book, created_at, onDelete }: RecentBookCardProps) => {
  const coverSrc = book.thumbnail_url?.startsWith('http') ? book.thumbnail_url : '/images/noImg.png';

  return (
    <Link href={makeHref(book.item_id)} className="block group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg ring-1 ring-black/5 bg-gray-50">
        <Image
          src={coverSrc}
          alt={book.title}
          fill
          sizes="140px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="secondary"
          aria-label="최근 본 책에서 삭제"
          className="z-20 absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          label={<X className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />}
          size="xs"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(book.item_id);
          }}
        />
      </div>

      <p className="mt-2 text-sm leading-5 font-semibold line-clamp-1 min-h-[20px] group-hover:text-[#af5858] transition-colors">
        {book.title}
      </p>
      {/* 상대 시간은 서버 렌더와 하이드레이션 시점이 달라 텍스트가 어긋날 수 있음 */}
      <p suppressHydrationWarning className="mt-2 text-xs font-medium line-clamp-2 leading-snug">
        {formatRelativeTime(created_at)}
      </p>
    </Link>
  );
};

export default RecentBookCard;
