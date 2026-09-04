import { getGenres } from '../category/getGenres';
import { HeaderGroups } from './types';
const genres = getGenres();
export const HEADER_GROUPS: HeaderGroups = [
  { key: 'Book', label: '국내도서', items: genres.koGenres },
  { key: 'Foreign', label: '외국도서', items: genres.foGenres },
  { key: 'eBook', label: 'eBook', items: genres.ebGenres },
];



