import { getGenres } from '@/app/lib/category/getGenres';
import HeaderCategories from './HeaderCategories';

const HeaderCategoriesServer = () => {
  const genres = getGenres();
  return <HeaderCategories koGenres={genres.koGenres} foGenres={genres.foGenres} ebGenres={genres.ebGenres} />;
};

export default HeaderCategoriesServer;
