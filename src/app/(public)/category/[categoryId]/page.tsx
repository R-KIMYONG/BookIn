import { Suspense } from 'react';;
import CategoryListSkeleton from './_components/CategoryListSkeleton';
import CategoryHeader from './_components/CategoryHeader';
import CategoryListWrapper from './_components/CategoryListWrapper';
import CategoryRailServer from './_components/CategoryRailServer';
import { RailsSkeleton } from '@/app/(private)/mypage/_components/recommend/rail/RailsSkeleton';
import { getYes24CategoryTree } from '@/shared/lib/yes24/getYes24CategoryTree';
import { findCategoryPath } from '@/shared/domain/category/tree';
import { parseCategoryId } from '@/shared/domain/book/ids';
import InvalidCategory from './_components/InvalidCategory';
import { Metadata } from 'next';
import { HOME_SECTIONS } from '@/shared/lib/yes24/constants';
import { toPage } from '@/shared/lib/yes24/searchParams';

export const maxDuration = 60;
type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ type?: string; page?: string }>;
};

export const generateMetadata = async ({ params }: CategoryPageProps): Promise<Metadata> => {
  const { categoryId: rawCategoryId } = await params;
  const categoryId = parseCategoryId(rawCategoryId);
  if (!categoryId) return { title: '존재하지 않는 카테고리' };

  const tree = await getYes24CategoryTree();
  const path = findCategoryPath(tree, categoryId);
  if (!path) return { title: '존재하지 않는 카테고리' };

  return { title: path[path.length - 1].name };
};

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const rawParams = await params;
  const rawSearchParams = await searchParams;
  const categoryId = parseCategoryId(rawParams.categoryId);

  if (!categoryId) return <InvalidCategory />;

  const categoryTree = await getYes24CategoryTree();

  const path = findCategoryPath(categoryTree, categoryId);

  if (!path) return <InvalidCategory />;

  const mallSection = HOME_SECTIONS.find((section) => section.categoryId === path[0].id);
  if (!mallSection) return <InvalidCategory />;

  const { tabs } = mallSection;
  const listType = tabs.find((tab) => tab === rawSearchParams.type) ?? tabs[0];
  const page = toPage(rawSearchParams.page ?? null);

  return (
    <main className="px-1 sm:px-6 md:px-10 flex-1">
      {/* <section className="w-full max-w-7xl mx-auto mt-6 flex flex-col px-4 sm:px-6 gap-4"> */}
      <section className="w-full max-w-7xl mx-auto mt-6 flex flex-col px-4 sm:px-6 gap-4">
        <CategoryHeader tree={categoryTree} path={path} />
        {/* 헤더와 같은 컨테이너 안에 둬야 좌우 폭이 맞음 */}
        <Suspense fallback={<CategoryListSkeleton tabs={tabs} active={listType} />}>
          <CategoryListWrapper categoryId={categoryId} listType={listType} page={page} tabs={tabs} />
        </Suspense>
      </section>
      <section className="w-full max-w-7xl mx-auto mt-6 flex flex-col px-4 sm:px-6 gap-4">
        <Suspense fallback={<RailsSkeleton col={1} />}>
          <CategoryRailServer categoryId={categoryId} />
        </Suspense>
      </section>
    </main>
  );
};

export default CategoryPage;
