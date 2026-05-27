import MyBooksHeader from './MyBooksHeader/MyBooksHeader';
import MyBooksSection from './MyBookSection/MyBooksSection';
import MyBooksPagination from './MyBooksPagination/MyBooksPagination';

const MyBooksContainer = () => {
  return (
    <>
      <MyBooksHeader />
      <MyBooksSection />
      <MyBooksPagination />
    </>
  );
};

export default MyBooksContainer;
