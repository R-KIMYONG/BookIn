'use client';

import { ReactElement, useState } from 'react';
import Button from '@/components/common/ui/Button';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { deleteAccount } from '@/app/actions/auth.actions';
import { showToast } from '@/shared/lib/message/showToast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const AccountDeletion = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();

    showToast(result.code);

    if (!result.ok) {
      return;
    }
    setUser(null);
    queryClient.clear();
    router.replace('/');
  };

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        title="재확인"
        message="정말로 회원탈퇴 하시겠습니까?"
        confirmColor="danger"
        confirmLabel="확인"
        cancelLabel="취소"
        formAction={handleDeleteAccount}
        onClose={onClose}
      />

      <div className="mt-4 flex justify-end">
        <Button type="button" label="회원 탈퇴" variant="danger" size="sm" onClick={onOpen} />
      </div>
    </>
  );
};

export default AccountDeletion;
