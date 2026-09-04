import { HEADER_GROUPS } from '@/shared/domain/header/constants';
import { RANGE, SEARCH_TYPE_LABEL } from '@/shared/domain/search/constants';
import { SearchOptionType } from '@/shared/domain/search/types';
import { ConditionBadge } from './ConditionBadge';

const SearchOptionView = ({ keyword, target, searchQueryType, categoryId }: SearchOptionType) => {
  const fieldLabel = SEARCH_TYPE_LABEL[searchQueryType];
  const targetLabel = RANGE.find((t) => t.v === target)?.label ?? '전체';
  const genres = HEADER_GROUPS.find((g) => g.key === target)?.items ?? [];
  const ciLabel = genres.find((g) => g.id === categoryId)?.label ?? '전체';
  return (
    <header className="px-1 py-6 sm:px-6 md:px-10">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
        <span className="text-main">‘{keyword}’</span> 검색 결과
      </h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <ConditionBadge label="필드" value={fieldLabel} />
        <ConditionBadge label="범위" value={targetLabel} />
        <ConditionBadge label="세부" value={ciLabel} />
      </div>
    </header>
  );
};

export default SearchOptionView;
