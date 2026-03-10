import useUrlParams from './useUrlParams';
const useCommentsUrlState = () => {
  const { getInt, setParams } = useUrlParams();

  const page = getInt('page', 1);

  const setCommentsUrl = (next: { page?: number | null }) => {
    setParams({ page: next.page ?? page });
  };

  return { page, setCommentsUrl };
};

export default useCommentsUrlState;
