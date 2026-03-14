import { MYPAGE_DEFAULT_QT, MYPAGE_QT_LIST, MypageModalType, MypageQueryType } from '@/types/useMypageUrlState.type';
import useUrlParams from './useUrlParams';

const useMypageUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();

  const rawQueryType = getParams('qt') ?? MYPAGE_DEFAULT_QT;
  const mypageQueryType = MYPAGE_QT_LIST.includes(rawQueryType as MypageQueryType) ? rawQueryType : MYPAGE_DEFAULT_QT;
  const page = getInt('page', 1);

  const rawModal = getParams('modal');
  const modalType: MypageModalType = rawModal === 'changePassword' ? 'changePassword' : null;

  const setMypageUrl = (next: { queryType?: MypageQueryType; page?: number | null; modal?: MypageModalType }) => {
    const nextQueryType = next.queryType ?? mypageQueryType;
    const nextPage = nextQueryType !== mypageQueryType ? 1 : (next.page ?? page);

    setParams({
      qt: nextQueryType,
      page: nextQueryType === 'userInfo' ? null : nextPage,
      modal: next.modal ?? null,
    });
  };
  return { mypageQueryType, page, modalType, setMypageUrl };
};

export default useMypageUrlState;
