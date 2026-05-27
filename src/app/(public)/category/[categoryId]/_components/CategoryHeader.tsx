'use client';

import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import useCategoryUrlState from '@/hooks/url/useCategoryUrlState';
import Button from '@/components/common/ui/Button';
import QueryTypeTabs from '@/components/common/filters/QueryTypeTabs';
import InvalidCategory from './InvalidCategory';
import { Genre } from '@/shared/domain/category/types';
import { classifyCategory } from '@/shared/domain/category/classifyCategory';

type CategoryHeaderProps = {
  categoryId: number;
  koreanGenres: Genre[];
  foreignGenres: Genre[];
  ebookGenres: Genre[];
};

const CategoryHeader = ({ categoryId, koreanGenres, foreignGenres, ebookGenres }: CategoryHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { isValidCategory, groupLabel, genreData, defaultTarget } = useMemo(
    () => classifyCategory({ categoryId, koreanGenres, foreignGenres, ebookGenres }),
    [koreanGenres, foreignGenres, ebookGenres, categoryId]
  );

  const { queryType, target, setCategoryUrl } = useCategoryUrlState({
    categoryId,
    defaultTarget,
  });

  if (!isValidCategory) return <InvalidCategory />;

  const handleTabClick = (id: number) => {
    const params = new URLSearchParams({ target, page: '1', qt: queryType });
    startTransition(() => {
      router.push(`/category/${id}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <p className="font-bold border-b text-center pb-3">{groupLabel}</p>

      <div className="md:flex-1 md:pr-3">
        <QueryTypeTabs
          value={queryType}
          onChange={(k) => setCategoryUrl({ queryType: k, searchKeyWord: null, page: 1 })}
          target={target}
        />
      </div>

      <nav
        role="tablist"
        className="border rounded-lg px-3 w-fit h-fit py-3 flex gap-2 box-border flex-row items-start"
      >
        <ul className="flex gap-2 w-fit flex-wrap">
          {genreData.map((tab, index) => {
            const active = tab.id === categoryId;
            return (
              <Button
                key={`${tab.id}-${tab.label}-${index}`}
                size="xs"
                variant={active ? 'primary' : 'secondary'}
                label={tab.label}
                disabled={isPending}
                onClick={() => handleTabClick(tab.id)}
              />
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default CategoryHeader;
