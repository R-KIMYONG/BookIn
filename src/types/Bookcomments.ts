import { BookGroup } from './commentBooks.type';
import { CommentTabType } from './useMypageUrlState.type';
import { MypageUserInfo } from './userInfo.type';

export type CommentTabsProps = {
  activeTab: CommentTabType;
  setActiveTab: (item: CommentTabType) => void;
};

export type CommentsListProps = {
  userInfo: MypageUserInfo;
  currentPage: number;
  setTotalPages: (page: number) => void;
};

export type CommentsByBookResult = {
  data: BookGroup[];
  total: number;
};
