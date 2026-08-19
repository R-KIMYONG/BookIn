import { RailResult } from '@/shared/domain/rails/types';
import { sliceView } from './sliceView';

export const sliceAll = (pools: RailResult, cursor: number): RailResult => {
  return {
    trending: { categoryName: pools.trending.categoryName, books: sliceView(pools.trending.books, cursor) },
    sniping: sliceView(pools.sniping, cursor),
    anchor: { title: pools.anchor.title, books: sliceView(pools.anchor.books, cursor) },
  };
};
