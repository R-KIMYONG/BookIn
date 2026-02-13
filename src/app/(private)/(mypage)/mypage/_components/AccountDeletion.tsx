import { createClient } from '@/utils/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import React, { useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ButtonComponent from '@/components/ButtonComponent';

const AccountDeletion = (): React.JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = createClient();
  const router = useRouter();

  const deleteUserLogout = useCallback(async () => {
    await supabase.auth.signOut();
    toast.success('회원탈퇴 되었습니다.');
    router.push('/');
  }, [supabase, router]);

  const deleteUser = async () => {
    try {
      const deleteResponse = await fetch('/api/auth/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) throw new Error(deleteResult?.error ?? '탈퇴실패');

      onClose();
      await deleteUserLogout();
    } catch (error) {
      if (error instanceof AuthError) {
        console.error('회원탈퇴 실패==>', error.message);
      }
      console.error('회원탈퇴 시 예상치 못한 에러 발생');
    }
  };
  return (
    <>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} shouldBlockScroll={false} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">재확인</ModalHeader>
              <ModalBody>
                <p>정말로 회원탈퇴 하시겠습니까?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={deleteUser}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ButtonComponent type="button" label="탈퇴" variant="danger" size="xs" onClick={onOpen} />
    </>
  );
};

export default AccountDeletion;
