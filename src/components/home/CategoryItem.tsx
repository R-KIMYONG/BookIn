import Image from 'next/image';
import { formatAuthor } from '@/shared/domain/book/formatAuthor';
import { BookSummary } from '@/shared/domain/book/types';
import BookmarkButton from '../book/BookmarkButton';
import BookStats from '../book/BookStats';
import LikeButton from '../book/LikeButton';
import { toCoverSrc } from '@/shared/domain/book/toCoverSrc';

type CategoryItemProps = {
  item: BookSummary;
  disabled?: boolean;
  viewCount: number;
  commentCount: number;
};

const CategoryItem = ({ item, disabled, viewCount, commentCount }: CategoryItemProps) => {
  const coverSrc = toCoverSrc(item.cover);
  //settings hydration으로 해야됨
  return (
    <article
      className={`w-full rounded-xl overflow-hidden bg-white shadow-sm transition
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
    >
      <div className={`relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-md ${disabled ? '' : 'group'}`}>
        <Image
          src={coverSrc}
          alt={`${item.title} 책 표지`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
        />

        {!item.adult && (
          <div className="absolute bottom-2 z-20 flex gap-1 items-center text-xs text-white justify-between w-full px-4">
            <LikeButton itemId={item.itemId} />
            <BookmarkButton itemId={item.itemId} scope="home" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h5 className="text-sm leading-5 font-semibold line-clamp-1 min-h-[20px]">{item.title}</h5>
        <div className="h-[16px] flex items-center justify-between">
          {/* YES24 목록 응답에는 평점이 없어 출판사로 대체 */}
          <span className="text-[11px] text-gray-500 truncate">{item.publisher}</span>
          <BookStats viewCount={viewCount} commentCount={commentCount} />
        </div>

        <p className="text-xs text-gray-600 truncate">{formatAuthor(item.author)}</p>
      </div>
    </article>
  );
};
export default CategoryItem;
