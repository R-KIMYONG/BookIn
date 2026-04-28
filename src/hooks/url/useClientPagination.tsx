import useUrlParams from './useUrlParams';

type Options = {
  paramKey?: string; 
  defaultPage?: number;
};

export const useClientPagination = (options?: Options) => {
  const paramKey = options?.paramKey ?? 'page';
  const defaultPage = options?.defaultPage ?? 1;

  const { getInt, setParams } = useUrlParams();

  const page = getInt(paramKey, defaultPage);

  const setPage = (nextPage: number) => {
    if (nextPage < 1) return;

    setParams(
      { [paramKey]: nextPage },
      { scroll: false, replace: false }
    );
  };

  return { page, setPage };
};
