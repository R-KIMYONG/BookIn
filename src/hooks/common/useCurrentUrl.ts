'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const useCurrentUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

export default useCurrentUrl;
