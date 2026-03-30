'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Genre } from '@/types/genre.type';
import { useRouter } from 'next/navigation';

type HeaderCategoriesProps = {
  koGenres: Genre[];
  foGenres: Genre[];
  ebGenres: Genre[];
};

const HeaderCategories = ({ koGenres, foGenres, ebGenres }: HeaderCategoriesProps) => {
  const router = useRouter();

  const groups: { key: string; label: string; items: Genre[] }[] = [
    { key: 'kr', label: '국내도서', items: koGenres },
    { key: 'fr', label: '외국도서', items: foGenres },
    { key: 'eb', label: 'eBook', items: ebGenres },
  ];

  return (
    <div className="flex items-center gap-8 md:gap-4 font-bold">
      {groups.map(({ key, label, items }) => (
        <Dropdown key={key}>
          <DropdownTrigger>
            <p className="text-white text-xs cursor-pointer">{label}</p>
          </DropdownTrigger>

          <DropdownMenu
            aria-label={`${label} 메뉴`}
            items={items}
            className="max-h-[200px] overflow-y-auto w-[200px]"
            onAction={(genreId) => {
              const target = key === 'kr' ? 'Book' : key === 'fr' ? 'Foreign' : 'eBook';
              router.push(`/category/${genreId}?target=${target}&page=1`);
            }}
          >
            {(genre: Genre) => (
              <DropdownItem key={genre.id} className="!text-[10px]">
                {genre.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      ))}
    </div>
  );
};

export default HeaderCategories;
