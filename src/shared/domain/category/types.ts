export type Genre = {
  label: string;
  id: number;
  path?: string;
};

export type GenresResult = {
  koGenres: Genre[];
  foGenres: Genre[];
  ebGenres: Genre[];
};
