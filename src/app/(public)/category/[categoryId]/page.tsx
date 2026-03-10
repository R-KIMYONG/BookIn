import { getGenres } from '@/app/lib/category/getGenres';
import { CategoryPageProps } from '@/types/categoryPage.type';
import CategoryClient from './_components/CategoryClient';
const CategoryPage = ({ params }: Pick<CategoryPageProps, 'params'>) => {
  const genres = getGenres();

  return (
    <CategoryClient
      params={params}
      koreanGenres={genres.koGenres}
      foreignGenres={genres.foGenres}
      ebookGenres={genres.ebGenres}
    />
  );
};

export default CategoryPage;
