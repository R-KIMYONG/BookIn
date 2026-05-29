'use client';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import MyBooksContainer from './MyBooksContainer';

const MypageContent = () => {
  const { query } = useMypageQueryState();
  switch (query.section) {
    case 'myBooks':
      return <MyBooksContainer />;
    case 'recommend':
      return <div className="mx-auto w-1/2 text-center py-10">서비스 준비중...</div>;
  }
};
export default MypageContent;
