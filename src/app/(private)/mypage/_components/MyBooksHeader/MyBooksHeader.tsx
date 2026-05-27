'use client';
import MyBooksTabs from './MyBooksTabs';
import MyBooksToolbar from './MyBooksToolbar';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/common/useDebounce';
import { useMypageQueryState } from '@/hooks/mypage/useMypageQueryState';
import { useUserTags } from '@/hooks/bookmark/useUserTags';

const MyBooksHeader = () => {
  const { query, setQuery } = useMypageQueryState();
  const { tab, search, sort, filter, tagId } = query;
  const [localSearch, setLocalSearch] = useState(search);
  const { data: userTags } = useUserTags();

  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch === search) return;

    setQuery({ search: debouncedSearch });
  }, [debouncedSearch, search, setQuery]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <>
      <MyBooksTabs tab={tab} onChange={(next) => setQuery({ tab: next })} />
      <MyBooksToolbar
        tab={tab}
        search={localSearch}
        onSearchChange={setLocalSearch}
        searchField={query.searchField}
        onSearchFieldChange={(v) => setQuery({ searchField: v })}
        sort={sort}
        onSortChange={(v) => setQuery({ sort: v })}
        filter={filter}
        onFilterChange={(v) => setQuery({ filter: v })}
        userTags={userTags ?? []}
        tag={tagId}
        onTagChange={(v) => setQuery({ tagId: v })}
      />
    </>
  );
};

export default MyBooksHeader;
