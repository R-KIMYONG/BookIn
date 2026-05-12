export type Genre = {
  label: string;
  id: number;
};

export type GenresResult = {
  koGenres: Genre[];
  foGenres: Genre[];
  ebGenres: Genre[];
};
