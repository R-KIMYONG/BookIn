import { getGenres } from '@/shared/domain/category/getGenres';
import CategoryClient from './_components/CategoryClient';
const CategoryPage = async ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const resolvedParams = await params;
  const genres = getGenres();
  return (
    <CategoryClient
      params={resolvedParams}
      koreanGenres={genres.koGenres}
      foreignGenres={genres.foGenres}
      ebookGenres={genres.ebGenres}
    />
  );
};

export default CategoryPage;
