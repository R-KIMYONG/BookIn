import { ALADIN_MAX_PAGES } from '../constants/pagination';

const getTotalPages = (totalResults: number, perPage: number) => {
  const safePerPage = Number.isFinite(perPage) && perPage && perPage > 0 ? perPage : 20;

  const safeTotalResults = Number.isFinite(totalResults) && totalResults && totalResults > 0 ? totalResults : 0;

  const rawTotalPages = Math.max(1, Math.ceil(safeTotalResults / safePerPage));

  return Math.min(ALADIN_MAX_PAGES, rawTotalPages);
};

export default getTotalPages;
