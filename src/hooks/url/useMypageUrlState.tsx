import { MYPAGE_DEFAULT_QT, MYPAGE_QT_LIST, MypageQueryType } from '@/types/useMypageUrlState.type';
import useUrlParams from './useUrlParams';

const useMypageUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();

  const rawQueryType = getParams('qt') ?? MYPAGE_DEFAULT_QT;
  const mypageQueryType = MYPAGE_QT_LIST.includes(rawQueryType as MypageQueryType) ? rawQueryType : MYPAGE_DEFAULT_QT;
  const page = getInt('page', 1);

  const setMypageUrl = (next: { queryType?: MypageQueryType; page?: number | null }) => {
    const nextQueryType = next.queryType ?? mypageQueryType;
    const nextPage = nextQueryType !== mypageQueryType ? 1 : (next.page ?? page);

    setParams({
      qt: nextQueryType,
      page: nextQueryType === 'userInfo' ? null : nextPage,
    });
  };
  return { mypageQueryType, page, setMypageUrl };
};

export default useMypageUrlState;
