import koGenres from '@/data/koGenres.json';
import foGenres from '@/data/foGenres.json';
import ebGenres from '@/data/ebGenres.json';
import { GenresResult } from './types';

export const getGenres = (): GenresResult => {
  return {
    koGenres: koGenres,
    foGenres: foGenres,
    ebGenres: ebGenres,
  };
};
