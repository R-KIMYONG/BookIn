export const statsKeys = {
  batch: (isbnList: string[]) => ['stats', [...isbnList].sort().join(',')],
};
