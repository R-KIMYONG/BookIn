import { BookmarkBook } from '@/types/myBooks.type';
import BooksGridContainer from './BooksGridContainer';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import BookmarkButton from '@/components/book/BookmarkButton';
import { MdFiberNew } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';
import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { useBookmarkMemoUrlState } from '@/hooks/url/useBookmarkMemoUrlState';
import TagArea from '@/components/bookmark/TagArea';

const NEW_DAYS = 3;
const BookmarkBooksList = ({ data }: { data: BookmarkBook[] }) => {
  const { open } = useBookmarkMemoUrlState();
  const isNewBookmark = (created_at?: string) => {
    if (!created_at) return false;
    const createdAt = dayjs(created_at);
    const deadline = createdAt.add(NEW_DAYS, 'day');
    return dayjs().isBefore(deadline);
  };
  const hasMemo = (memo?: string | null) => {
    if (!memo) return false;

    const text = memo
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, '')
      .trim();

    return text.length > 0;
  };

  return (
    <BooksGridContainer>
      {data.map((book, index) => {
        const isAboveFold = index < 5;
        const newBadge = isNewBookmark(book.created_at);
        const memoExists = hasMemo(book.memo);
        const date = dayjs(book.created_at).locale('ko').format('YYYY-MM-DD HH:mm');
        const bookInfo = { isbn13: book.isbn13, cover: book.cover, title: book.title, author: book.author };

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
            <Link href={`/${book.isbn13}`}>
              <div className="h-60 relative overflow-hidden rounded-md">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 44vw, 200px"
                  priority={isAboveFold}
                />
                {newBadge && <MdFiberNew className="h-6 w-6 text-red-500 absolute top-2 right-2" />}
                <div className="absolute inset-0 bg-black/40" />
                <BookmarkButton bookInfo={bookInfo} style="absolute top-2 left-2" scope="mypage" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-bold line-clamp-1 text-xs">{book.title}</p>

                  <div className="flex flex-col justify-between text-xs mt-1">
                    <span className="mb-2">{book.created_at ? date : ''}</span>

                    <ButtonComponent
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        open(book.isbn13, 'mypage');
                      }}
                      variant="ghost"
                      className={
                        memoExists
                          ? '!bg-emerald-500/70 !text-white hover:!bg-emerald-500/80 transition-all'
                          : '!bg-white/10 !text-white hover:!bg-white/40 transition-all'
                      }
                      aria-label={memoExists ? '북마크 메모 보기/수정' : '북마크 메모 작성'}
                      leftIcon={<FiEdit3 className="h-3.5 w-3.5" />}
                      label={memoExists ? '메모 편집' : '메모 작성'}
                    />
                  </div>
                </div>
              </div>
            </Link>
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
