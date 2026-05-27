import { Item } from '@/shared/types/api';
import Image from 'next/image';
import LikeButton from '../book/LikeButton';
import BookmarkButton from '../book/BookmarkButton';
import { Star } from 'lucide-react';

const CategoryItem = ({ item, disabled }: { item: Item; disabled?: boolean }) => {
  const rating = item.customerReviewRank ?? 0;
  const coverSrc = item.cover?.startsWith('http') ? item.cover : '/images/noImg.png';
  //청불 처리 필요
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
          unoptimized
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
        />

        <div className="absolute bottom-2 z-20 flex gap-1 items-center text-xs text-white justify-between w-full px-4">
          <LikeButton
            bookInfo={{
              isbn13: item.isbn13,
              title: item.title,
              cover: item.cover,
              author: item.author,
            }}
          />

          <BookmarkButton
            bookInfo={{
              isbn13: item.isbn13,
              title: item.title,
              cover: item.cover,
              author: item.author,
            }}
            scope="home"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h5 className="text-sm leading-5 font-semibold line-clamp-2 min-h-[40px]">{item.title}</h5>
        <div className="h-[16px] flex items-center">
          {rating > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-800 font-semibold">{rating}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 truncate">저자: {item.author?.split(',')[0] ?? '저자 정보 없음'}</p>
      </div>
    </article>
  );
};
export default CategoryItem;
