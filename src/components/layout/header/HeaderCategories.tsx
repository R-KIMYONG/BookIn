'use client';

import Dropdown from '@/components/common/ui/Dropdown';
import { Genre, GenresResult } from '@/shared/domain/category/types';
import { useRouter } from 'next/navigation';

const HeaderCategories = ({ koGenres, foGenres, ebGenres }: GenresResult) => {
  const router = useRouter();

  const groups: { key: string; label: string; items: Genre[] }[] = [
    { key: 'kr', label: '국내도서', items: koGenres },
    { key: 'fr', label: '외국도서', items: foGenres },
    { key: 'eb', label: 'eBook', items: ebGenres },
  ];

  return (
    <div className="flex gap-6 text-white text-xs">
      {groups.map(({ key, label, items }) => (
        <Dropdown
          key={key}
          trigger={<p className="cursor-pointer font-bold">{label}</p>}
          items={items.map((g) => ({
            type: 'action',
            label: g.label,
            value: g.id,
          }))}
          onSelect={(genreId) => {
            const target = key === 'kr' ? 'Book' : key === 'fr' ? 'Foreign' : 'eBook';
            router.push(`/category/${genreId}?target=${target}&page=1`);
          }}
        />
      ))}
    </div>
  );
};

export default HeaderCategories;
