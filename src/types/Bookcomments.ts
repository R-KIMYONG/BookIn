import { BookGroup } from './commentBooks.type';
import { UserInfoType } from './userInfo.type';
export type CommentsTabType = 'byBook' | 'all';

export type CommentTabsProps = {
  activeTab: CommentsTabType;
  setActiveTab: (item: CommentsTabType) => void;
};

export type CommentsListProps = {
  userInfo: UserInfoType;
  currentPage: number;
  setTotalPages: (page: number) => void;
};

export type CommentsByBookResult = {
  data: BookGroup[];
  total: number;
};
