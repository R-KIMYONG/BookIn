import {
  COMMENT_DEFAULT_TAB,
  COMMENT_TAB_LIST,
  CommentTabType,
  MYPAGE_DEFAULT_SECTION,
  MYPAGE_SECTION_LIST,
  MypageModalType,
  MypageSectionType,
} from '@/types/useMypageUrlState.type';
import useUrlParams from './useUrlParams';

const useMypageUrlState = () => {
  const { getParams, getInt, setParams } = useUrlParams();

  const rawSection = getParams('section') ?? MYPAGE_DEFAULT_SECTION;
  const mypageSection = MYPAGE_SECTION_LIST.includes(rawSection as MypageSectionType)
    ? (rawSection as MypageSectionType)
    : MYPAGE_DEFAULT_SECTION;

  const rawCommentTab = getParams('commentTab') ?? COMMENT_DEFAULT_TAB;
  const commentTab = COMMENT_TAB_LIST.includes(rawCommentTab as CommentTabType)
    ? (rawCommentTab as CommentTabType)
    : COMMENT_DEFAULT_TAB;
  const page = getInt('page', 1);

  const rawModal = getParams('modal');
  const modalType: MypageModalType = rawModal === 'changePassword' ? 'changePassword' : null;

  const setMypageUrl = (next: {
    section?: MypageSectionType;
    commentTab?: CommentTabType;
    page?: number | null;
    modal?: MypageModalType;
  }) => {
    const nextSection = next.section ?? mypageSection;
    const nextPage = nextSection !== mypageSection ? 1 : (next.page ?? page);

    setParams({
      section: next.section ?? mypageSection,
      commentTab: nextSection === 'commentList' ? (next.commentTab ?? commentTab) : null,
      page: nextSection === 'userInfo' ? null : nextPage,
      modal: next.modal ?? null,
    });
  };
  return { mypageSection, commentTab, page, modalType, setMypageUrl };
};

export default useMypageUrlState;
