import SearchBar from '@/components/common/filters/SearchBar';
import { HEADER_GROUPS } from '@/shared/domain/header/constants';

const SearchBarContainer = () => {
  return <SearchBar genres={HEADER_GROUPS} />;
};

export default SearchBarContainer;
