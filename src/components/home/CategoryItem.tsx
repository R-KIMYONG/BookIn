import { Item } from '@/types/book.type';
import { Card, CardBody, CardFooter } from '@nextui-org/react';
import Image from 'next/image';

interface CategoryItemProps {
  item: Item;
}

export default function CategoryItem({ item }: CategoryItemProps) {
  return (
    <Card shadow="md" isPressable className="w-full">
      <CardBody className="p-0 group">
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-white ">
          <Image
            src={item.cover}
            alt={`${item.title} 포스터`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-sm z-99 text-justify">
          <p className="line-clamp-6">{item.description || '설명 없음'}</p>
        </div>
      </CardBody>
      <CardFooter className="text-sm flex flex-col justify-start items-start gap-2 mt-2">
        <h5 className="text-[12px] font-semibold leading-5 line-clamp-2 min-h-[2rem] text-justify">{item.title}</h5>

        <p className="text-[10px] leading-5 line-clamp-2 min-h-[2rem]">저자: {item.author}</p>
      </CardFooter>
    </Card>
  );
}
