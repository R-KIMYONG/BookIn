'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE, ResultCode } from '@/shared/lib/message/resultCode';

export const SOCIAL_PROVIDER_LABEL = {
  google: 'Google',
  github: 'GitHub',
  kakao: 'Kakao',
} as const;

const getProviderLabel = (provider?: string | null) => {
  if (!provider) return undefined;
  if (provider.includes('google')) return 'Google';
  if (provider.includes('github')) return 'GitHub';
  if (provider.includes('kakao')) return 'Kakao';

  return undefined;
};

const AuthToastHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const toast = params.get('toast');
    const provider = params.get('provider');

    if (!toast || !Object.values(RESULT_CODE).includes(toast as ResultCode)) {
      return;
    }

    showToast(toast as ResultCode, {
      variables: {
        providerLabel: getProviderLabel(provider),
      },
    });

    params.delete('toast');
    params.delete('provider');

    const nextQuery = params.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, {
      scroll: false,
    });
  }, [searchParams, pathname, router]);

  return null;
};

export default AuthToastHandler;
