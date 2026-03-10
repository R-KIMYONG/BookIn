import { Genre } from './genre.type';

export type CategoryPageProps = {
  params: { categoryId: string };
  koreanGenres: Genre[];
  foreignGenres: Genre[];
  ebookGenres: Genre[];
};
