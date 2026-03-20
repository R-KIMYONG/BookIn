'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TempSessionModal from '../modal/TempSessionModal';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { TEMP_SESSION_SOON_TOAST_ID } from '../layout/header/TempSessionBadge';
import { useQueryClient } from '@tanstack/react-query';
const SessionExpiredModalHandler = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoginPage = pathname.startsWith('/login');
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  const isExpiredModalOpen = searchParams.get('session') === 'expired';

  const removeSessionParam = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('session');

    const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  useEffect(() => {
    if (!isExpiredModalOpen) return;
    queryClient.removeQueries({ queryKey: ['user'] });
    toast.dismiss(TEMP_SESSION_SOON_TOAST_ID);
  }, [isExpiredModalOpen, queryClient]);

  const onClose = () => {
    removeSessionParam();
  };

  const onGoLogin = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  };

  if (!isExpiredModalOpen) return null;
  return (
    <TempSessionModal
      isOpen={isExpiredModalOpen}
      isExpired={true}
      remainingSec={0}
      countDownText={null}
      onClose={onClose}
      onGoLogin={!isLoginPage ? onGoLogin : undefined}
      showGoLoginButton={!isLoginPage}
    />
  );
};

export default SessionExpiredModalHandler;
