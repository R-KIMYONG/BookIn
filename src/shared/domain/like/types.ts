export type LikeCache = {
  isbn13: string;
  liked: boolean;
  liked_count: number;
};

export type LikeResponseUserType = {
  isbn13: string;
  liked: boolean;
};

export type LikeResponseCountType = {
  isbn13: string;
  liked_count: number;
};
