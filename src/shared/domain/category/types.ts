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

export type CategoryNode = {
  id: string;
  name: string;
  children: CategoryNode[]; // 자기 자신과 같은 타입
};
