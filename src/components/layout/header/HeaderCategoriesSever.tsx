import { getGenres } from '@/app/lib/category/getGenres';
import HeaderCategories from './HeaderCategories';

const HeaderCategoriesServer = () => {
  const { koGenres, foGenres, ebGenres } = getGenres();

  return <HeaderCategories koGenres={koGenres} foGenres={foGenres} ebGenres={ebGenres} />;
};

export default HeaderCategoriesServer;
