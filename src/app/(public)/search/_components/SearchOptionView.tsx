import { SEARCH_CATEGORY_LABEL, SEARCH_SORT_LABEL } from '@/shared/domain/search/constants';
import { SearchOptionType } from '@/shared/domain/search/types';
import { ConditionBadge } from './ConditionBadge';

const SearchOptionView = ({ keyword, category, sort }: SearchOptionType) => {
  return (
    <header className="px-1 py-6 sm:px-6 md:px-10">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
        <span className="text-main">‘{keyword}’</span> 검색 결과
      </h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <ConditionBadge label="범위" value={SEARCH_CATEGORY_LABEL[category]} />
        <ConditionBadge label="정렬" value={SEARCH_SORT_LABEL[sort]} />
      </div>
    </header>
  );
};

export default SearchOptionView;
