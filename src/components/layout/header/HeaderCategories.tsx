'use client';

import useGenres from '@/hooks/useGenres';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Genre } from '@/types/genre.type';
import { useRouter } from 'next/navigation';

export default function HeaderCategories() {
  const router = useRouter();
  const { koreanGenres, foreignGenres, ebookGenres } = useGenres();
  const groups: { key: string; label: string; items?: Genre[] }[] = [
    { key: 'kr', label: '국내도서', items: koreanGenres },
    { key: 'fr', label: '외국도서', items: foreignGenres },
    { key: 'eb', label: 'eBook', items: ebookGenres },
  ];

  return (
    <div className="flex items-center gap-4 font-bold">
      {groups.map(({ key, label, items }) => (
        <Dropdown key={key}>
          <DropdownTrigger>
            <p className="text-white text-xs cursor-pointer">{label}</p>
          </DropdownTrigger>
          <DropdownMenu
            aria-label={`${label} 메뉴`}
            items={items ?? []}
            className="max-h-[200px] overflow-y-auto w-[200px]"
            onAction={(genreId) => {
              const target = key === 'kr' ? 'Book' : key === 'fr' ? 'Foreign' : 'ebook';
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
}
