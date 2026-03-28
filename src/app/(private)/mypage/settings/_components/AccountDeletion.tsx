import { useDisclosure } from '@nextui-org/react';
import ButtonComponent from '@/components/common/ButtonComponent';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { deleteAccount } from '@/app/actions/auth.actions';

const AccountDeletion = (): React.JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        title="재확인"
        message="정말로 회원탈퇴 하시겠습니까?"
        confirmColor="danger"
        confirmLabel="확인"
        cancelLabel="취소"
        formAction={deleteAccount}
        onClose={onClose}
      />
      <div className="mt-4 flex justify-end">
        <ButtonComponent type="button" label="회원 탈퇴" variant="danger" size="sm" onClick={onOpen} />
      </div>
    </>
  );
};

export default AccountDeletion;
