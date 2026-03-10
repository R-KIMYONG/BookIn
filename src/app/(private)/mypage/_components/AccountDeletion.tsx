import { createClient } from '@/utils/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ButtonComponent from '@/components/common/ButtonComponent';
import ConfirmModal from '@/components/modal/ConfirmModal';

const AccountDeletion = (): React.JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = createClient();
  const router = useRouter();

  const deleteUser = async () => {
    try {
      const deleteResponse = await fetch('/api/auth/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) throw new Error(deleteResult?.error ?? '탈퇴실패');

      onClose();
      await supabase.auth.signOut(); //확실히 로그아웃한번 진행
      toast.success('회원탈퇴 되었습니다.'); // 완료 안내
      router.push('/'); // 홈으로 이동
    } catch (error) {
      if (error instanceof AuthError) {
        console.error('회원탈퇴 실패==>', error.message);
      }
      console.error('회원탈퇴 시 예상치 못한 에러 발생');
    }
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
        onConfirm={deleteUser}
        onClose={onClose}
      />
      <ButtonComponent type="button" label="탈퇴" variant="danger" size="xs" onClick={onOpen} />
    </>
  );
};

export default AccountDeletion;
