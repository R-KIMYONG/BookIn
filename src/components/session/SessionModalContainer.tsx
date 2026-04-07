'use client';

import SessionModal from '@/components/modal/SessionModal';
import { useSessionModal } from '@/stores/useSessionModal';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
export const STORAGE_KEY = 'session_expired';
const SessionModalContainer = () => {
  const { modal, close, openExpired } = useSessionModal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (modal?.type === 'expired') return;

    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
      const { redirectTo } = JSON.parse(raw);
      openExpired(redirectTo ?? '/');
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [openExpired]);

  if (!modal) return null;

  const isLoginPage = pathname.startsWith('/login');

  const onGoLogin = () => {
    if (modal.type !== 'expired') return;

    close();
    sessionStorage.removeItem(STORAGE_KEY);
    router.push(`/login?redirectTo=${encodeURIComponent(modal.redirectTo)}`);
  };

  const onClose = () => {
    close();
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SessionModal
      isOpen
      isExpired={modal.type === 'expired'}
      onClose={onClose}
      onExtend={modal.type === 'soon' ? modal.onExtend : undefined}
      onGoLogin={modal.type === 'expired' && !isLoginPage ? onGoLogin : undefined}
      showGoLoginButton={!isLoginPage}
    />
  );
};

export default SessionModalContainer;
