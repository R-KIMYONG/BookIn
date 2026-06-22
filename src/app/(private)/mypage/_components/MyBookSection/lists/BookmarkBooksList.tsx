import { BookmarkBook } from '@/shared/domain/mybooks/types';
import BooksGridContainer from './BooksGridContainer';
import Link from 'next/link';
import Image from 'next/image';
import BookmarkButton from '@/components/book/BookmarkButton';
import { PencilLine } from 'lucide-react';
import Button from '@/components/common/ui/Button';
import TagArea from '@/components/bookmark/TagArea';
import { hasMemo } from '@/shared/domain/bookmark/hasMemo';
import { formatDateTime } from '@/shared/lib/date/formatDateTime';
import { isNew } from '@/shared/lib/date/isNew';
import { NEW_DAYS } from '@/shared/domain/bookmark/constants';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import BookStats from '@/components/book/BookStats';

const BookmarkBooksList = ({ data }: { data: BookmarkBook[] }) => {
  const { open } = useBookmarkMemoUrlState();
  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const isAboveFold = index < 6;
        const newBadge = isNew(book.created_at, NEW_DAYS);
        const memoExists = hasMemo(book.memo);
        const date = formatDateTime(book.created_at);
        const bookInfo = {
          isbn13: book.isbn13,
          cover: book.cover,
          title: book.title,
          author: book.author,
          categoryId: book.categoryId,
          categoryName: book.categoryName,
        };
        const tagNames = (book.tags ?? [])
          .map((tag) => {
            return {
              id: tag.id,
              name: tag.name,
              color: tag.color,
              slug: tag.slug,
            };
          })
          .filter(Boolean);
        return (
          <li key={book.book_id}>
            <div className="relative">
              <Link href={`/${book.isbn13}`} className="block">
                <div className="relative h-60 overflow-hidden rounded-md group">
                  <Image
                    src={book.cover?.trim() ? book.cover : '/images/noImg.png'}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 44vw, 200px"
                    unoptimized
                    priority={isAboveFold}
                  />
                  {newBadge && (
                    <span className="absolute right-2 top-2 z-20 rounded-full bg-red-500 px-2 py-1 text-[10px] font-black tracking-wide text-white shadow-md ring-1 ring-white/80">
                      NEW
                    </span>
                  )}
                  <div className="absolute inset-0 z-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
                  <BookmarkButton bookInfo={bookInfo} style="absolute top-2 left-2" scope="mypage" />

                  <div className="absolute bottom-16 left-3 right-3 z-10 text-white">
                    <p className="line-clamp-1 text-xs font-bold">{book.title}</p>
                    <BookStats
                      viewCount={book.total_view_count}
                      likeCount={book.total_like_count}
                      commentCount={book.total_comment_count}
                      size="xs"
                      className="text-white mt-1"
                    />
                    <span className="mt-1 block text-[11px] text-gray-200">{book.created_at ? date : ''}</span>
                  </div>
                </div>
              </Link>
              <div className="absolute bottom-3 left-3 right-3 text-white z-20">
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    open(book.isbn13, 'mypage');
                  }}
                  fullWidth
                  variant="ghost"
                  className={
                    memoExists
                      ? '!bg-emerald-500/70 !text-white hover:!bg-emerald-500/80 transition-all'
                      : '!bg-white/10 !text-white hover:!bg-white/40 transition-all'
                  }
                  aria-label={memoExists ? '북마크 메모 보기/수정' : '북마크 메모 작성'}
                  leftIcon={<PencilLine className="h-3.5 w-3.5" />}
                  label={memoExists ? '메모 편집' : '메모 작성'}
                />
              </div>
            </div>
            <div className="mt-2 h-16 lg:h-10 text-xs flex">
              {tagNames.length > 0 ? (
                <TagArea tagNames={tagNames} onMore={() => open(book.isbn13, 'mypage')} scope="mypage" />
              ) : (
                <span
                  className="text-gray-400 cursor-pointer hover:text-gray-500"
                  onClick={() => open(book.isbn13, 'mypage')}
                >
                  태그를 추가해보세요
                </span>
              )}
            </div>
          </li>
        );
      })}
    </BooksGridContainer>
  );
};

export default BookmarkBooksList;
