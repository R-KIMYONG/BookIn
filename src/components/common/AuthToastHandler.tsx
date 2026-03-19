'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { AUTH_FEEDBACK_TEXT } from '@/app/lib/auth/authActionFeedback';

const AuthToastHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (!error && !message) return;

    const code = error ?? message;
    if (!code) return;

    const text = AUTH_FEEDBACK_TEXT[code as keyof typeof AUTH_FEEDBACK_TEXT] ?? AUTH_FEEDBACK_TEXT.unknown;

    if (error) {
      toast.error(text, { position: 'top-right' });
    } else {
      toast.success(text, { position: 'top-right' });
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('error');
    nextParams.delete('message');

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
};

export default AuthToastHandler;
