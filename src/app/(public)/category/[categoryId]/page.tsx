import { Suspense } from 'react';
import { getGenres } from '@/shared/domain/category/getGenres';
import { DEFAULT_QT, QUERY_TYPE_LIST } from '@/shared/domain/aladin/constants';
import { ALLOWED_TARGETS, TargetTypes } from '@/shared/constants/category';
import SkeletonGrid from '@/components/common/SkeletonGrid';
import CategoryHeader from './_components/CategoryHeader';
import CategoryListWrapper from './_components/CategoryListWrapper';
import { redirect } from 'next/navigation';
import { classifyCategory } from '@/shared/domain/category/classifyCategory';
import { QueryType } from '@/shared/domain/aladin/types';

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ qt?: QueryType; page?: string; target?: TargetTypes }>;
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const rawParams = await params;
  const rawSearchParams = await searchParams;

  const categoryId = Number(rawParams.categoryId);

  const queryType = QUERY_TYPE_LIST.includes(rawSearchParams.qt as QueryType)
    ? (rawSearchParams.qt as QueryType)
    : DEFAULT_QT;

  const genres = getGenres();
  const { defaultTarget: computedDefault, genreData } = classifyCategory({
    categoryId,
    koreanGenres: genres.koGenres,
    foreignGenres: genres.foGenres,
    ebookGenres: genres.ebGenres,
  });

  if (!rawSearchParams.target) {
    const redirectParams = new URLSearchParams({
      target: computedDefault,
      qt: rawSearchParams.qt ?? DEFAULT_QT,
      page: rawSearchParams.page ?? '1',
    });
    redirect(`/category/${categoryId}?${redirectParams.toString()}`);
  }

  const target = ALLOWED_TARGETS.includes(rawSearchParams.target as TargetTypes)
    ? (rawSearchParams.target as TargetTypes)
    : computedDefault;

  const page = Number(rawSearchParams.page ?? 1);
  return (
    <section className="max-w-7xl m-auto mt-6 flex flex-col px-10 gap-4">
      <CategoryHeader
        categoryId={categoryId}
        koreanGenres={genres.koGenres}
        foreignGenres={genres.foGenres}
        ebookGenres={genres.ebGenres}
        target={target}
        page={page}
      />

      <div className="w-full flex-1">
        <Suspense key={`${categoryId}-${queryType}-${target}`} fallback={<SkeletonGrid count={20} />}>
          <CategoryListWrapper
            categoryId={categoryId}
            queryType={queryType}
            target={target}
            page={page}
            genreData={genreData}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default CategoryPage;
