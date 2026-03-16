export type MypageSectionType = 'userInfo' | 'commentList';
export type CommentTabType = 'commentAll' | 'commentByBook';

export const MYPAGE_SECTION_LIST: MypageSectionType[] = ['userInfo', 'commentList'];
export const COMMENT_TAB_LIST: CommentTabType[] = ['commentAll', 'commentByBook'];

export const MYPAGE_DEFAULT_SECTION: MypageSectionType = 'userInfo';
export const COMMENT_DEFAULT_TAB: CommentTabType = 'commentByBook';

export type MypageModalType = 'changePassword' | null;
