import {
  MYPAGE_DEFAULT_SECTION,
  MYPAGE_SECTION_LIST,
  MypageModalType,
  MypageSectionType,
  MYBOOKS_DEFAULT_TAB,
  MYBOOKS_TAB_LIST,
  MyBooksTabType,
} from '@/types/useMypageUrlState.type';
import useUrlParams from './useUrlParams';

const useMypageUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();

  // section
  const rawSection = getParams('section') ?? MYPAGE_DEFAULT_SECTION;
  const mypageSection = MYPAGE_SECTION_LIST.includes(rawSection as MypageSectionType)
    ? (rawSection as MypageSectionType)
    : MYPAGE_DEFAULT_SECTION;

  // tab
  const rawTab = getParams('tab') ?? MYBOOKS_DEFAULT_TAB;
  const tab = MYBOOKS_TAB_LIST.includes(rawTab as MyBooksTabType) ? (rawTab as MyBooksTabType) : MYBOOKS_DEFAULT_TAB;

  // page
  const page = getInt('page', 1);

  // modal
  const rawModal = getParams('modal');
  const modalType: MypageModalType = rawModal === 'changePassword' ? 'changePassword' : null;

  // setter
  const setMypageUrl = (next: {
    section?: MypageSectionType;
    tab?: MyBooksTabType;
    page?: number | null;
    modal?: MypageModalType;
  }) => {
    const nextSection = next.section ?? mypageSection;
    const nextTab = next.tab ?? tab;
    const nextPage = next.page ?? 1;

    setParams({
      section: nextSection,
      tab: nextTab,
      page: nextPage,
      modal: next.modal ?? null,
    });
  };

  return { mypageSection, tab, page, modalType, setMypageUrl };
};

export default useMypageUrlState;
