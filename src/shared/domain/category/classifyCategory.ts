import { Genre } from './types';
import { TargetTypes } from '@/shared/constants/category';

type ClassifyCategoryArgs = {
  categoryId: number;
  koreanGenres: Genre[];
  foreignGenres: Genre[];
  ebookGenres: Genre[];
};

type CategoryClassification = {
  isValidCategory: boolean;
  groupLabel: string;
  genreData: Genre[];
  defaultTarget: TargetTypes;
};

export const classifyCategory = ({
  categoryId,
  koreanGenres,
  foreignGenres,
  ebookGenres,
}: ClassifyCategoryArgs): CategoryClassification => {
  const isValidNum = Number.isFinite(categoryId) && categoryId > 0;

  const kr = koreanGenres ?? [];
  const fr = foreignGenres ?? [];
  const eb = ebookGenres ?? [];

  if (!isValidNum) {
    return { isValidCategory: false, groupLabel: '', genreData: [], defaultTarget: 'Book' };
  }

  if (kr.some((g) => g.id === categoryId)) {
    return { isValidCategory: true, groupLabel: '국내도서', genreData: kr, defaultTarget: 'Book' };
  }
  if (fr.some((g) => g.id === categoryId)) {
    return { isValidCategory: true, groupLabel: '외국도서', genreData: fr, defaultTarget: 'Foreign' };
  }
  if (eb.some((g) => g.id === categoryId)) {
    return { isValidCategory: true, groupLabel: 'eBook', genreData: eb, defaultTarget: 'eBook' };
  }

  return { isValidCategory: false, groupLabel: '', genreData: [], defaultTarget: 'Book' };
};
