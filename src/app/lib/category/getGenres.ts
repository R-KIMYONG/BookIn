import koGenres from '@/data/koGenres.json';
import foGenres from '@/data/foGenres.json';
import ebGenres from '@/data/ebGenres.json';
import { Genre } from '@/types/genre.type';
type GenresResult = {
  koGenres: Genre[];
  foGenres: Genre[];
  ebGenres: Genre[];
};
export const getGenres = (): GenresResult => {
  return {
    koGenres: koGenres as Genre[],
    foGenres: foGenres as Genre[],
    ebGenres: ebGenres as Genre[],
  };
};
