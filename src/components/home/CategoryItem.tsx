import { Item } from '@/types/book.type';
import Image from 'next/image';
interface CategoryItemProps {
  item: Item;
  disabled?: boolean;
}

export default function CategoryItem({ item, disabled }: CategoryItemProps) {
  return (
    <article
      className={`w-full rounded-xl overflow-hidden bg-white shadow-md transition 
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
    >
      <div className={`relative h-40 bg-white ${disabled ? '' : 'group'}`}>
        <Image
          src={item.cover || '/no-image.png'}
          alt={`${item.title} 포스터`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
        />
        <div className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-sm text-start">
          <p className="line-clamp-6">{item.description || '설명 없음'}</p>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h5 className="text-[12px] font-semibold leading-5 line-clamp-2 h-[40px] text-start">{item.title}</h5>
        <p className="text-[10px] leading-5 line-clamp-2 h-[40px] text-start">저자: {item.author}</p>
      </div>
    </article>
  );
}
