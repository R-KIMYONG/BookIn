'use client';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import MyBooksContainer from './MyBooksContainer';
import RecommendContainer from './recommend/RecommendContainer';

const MypageContent = () => {
  const { query } = useMypageQueryState();
  switch (query.section) {
    case 'myBooks':
      return <MyBooksContainer />;
    case 'recommend':
      return <RecommendContainer />;
  }
};
export default MypageContent;
