'use client';

import Dropdown from '@/components/common/ui/Dropdown';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { useRouter } from 'next/navigation';

const HeaderCategories = () => {
  const router = useRouter();

  return (
    <div className="flex gap-6 text-white text-xs">
      {HEADER_GROUPS.map(({ key, label, items }) => (
        <Dropdown
          key={key}
          trigger={<p className="cursor-pointer font-bold">{label}</p>}
          items={items.map((g) => ({
            type: 'action',
            label: g.label,
            value: g.id,
          }))}
          onSelect={(genreId) => {
            const target = key === 'Book' ? 'Book' : key === 'Foreign' ? 'Foreign' : 'eBook';
            router.push(`/category/${genreId}?target=${target}&page=1`);
          }}
        />
      ))}
    </div>
  );
};

export default HeaderCategories;
