import React, { useCallback, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { toast } from 'react-toastify';
import ButtonComponent from '@/components/common/ButtonComponent';
import PasswordFields from '@/components/form/PasswordFields';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isValidPassword } from '@/app/lib/validation/isPassword';
import useMypageUrlState from '@/hooks/url/useMypageUrlState';

const ChangePassWord = ({ userId }: { userId: string }): React.JSX.Element => {
  const { modalType, setMypageUrl } = useMypageUrlState();
  const isOpen = modalType === 'changePassword';
  const queryClient = useQueryClient();
  const [passwordMissMatch, setPasswordMissMatch] = useState<boolean>(false);
  const [checkPrevPW, setCheckPrevPW] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<{
    newPassword: string;
    confirmPassword: string;
    prevPassword: string;
  }>({
    newPassword: '',
    confirmPassword: '',
    prevPassword: '',
  });
  const handleOpen = () => {
    setMypageUrl({ modal: 'changePassword' });
  };

  const handleClose = () => {
    setMypageUrl({ modal: null });
    setPasswordMissMatch(false);
    setCheckPrevPW(false);
    setPasswordForm({
      newPassword: '',
      confirmPassword: '',
      prevPassword: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordForm((prev) => {
      const nextChangePassword = {
        ...prev,
        [name]: value,
      };
      //비밀번호 컨펌 디스매치 기준
      //컨펌 비밀번호 입력할때
      //입력한 컨펌비밀번호가 8자리이상일때(비밀번호 정책에 맞게)
      //컨펌빔리번호 비여있지않을때 검증시작
      if (
        name === 'confirmPassword' &&
        nextChangePassword.confirmPassword.length >= 8 &&
        nextChangePassword.confirmPassword.trim() !== ''
      ) {
        setPasswordMissMatch(nextChangePassword.newPassword !== nextChangePassword.confirmPassword);
      } else {
        setPasswordMissMatch(false);
      }

      return nextChangePassword;
    });
  };

  const changePassWordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '비밀번호 변경 실패');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      toast.success('비밀번호 변경 완료', { position: 'top-right' });
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message, { position: 'top-right' });
    },
  });
  const handleSaveNewPassWord = useCallback<() => Promise<void>>(async () => {
    if (passwordForm.newPassword.trim() === '') {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    if (passwordForm.confirmPassword.trim() === '') {
      toast.error('비밀번호 확인 비어있습니다.');
      return;
    }
    if (!isValidPassword(passwordForm.newPassword)) {
      toast.error('비밀번호는 8~12자리 이어야 하며, 알파벳, 숫자 및 특수문자를 포함해야 합니다.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    changePassWordMutation.mutate(passwordForm.newPassword);
  }, [passwordForm, changePassWordMutation, queryClient, userId, handleClose]);

  const checkPrevPassWordMutation = useMutation({
    mutationFn: async (prevPassword: string) => {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: prevPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? '현재 비밀번호 확인 실패');
      return result;
    },
    onSuccess: () => {
      setCheckPrevPW(true);
      toast.success('현재 비밀번호가 확인되었습니다.', { position: 'top-right' });
    },
    onError: (error) => {
      toast.error(error.message, { position: 'top-right' });
      setCheckPrevPW(false);
    },
  });
  const handleCheckPrevPassWord = () => {
    if (passwordForm.prevPassword.trim() === '') {
      toast.error('현재 비밀번호를 입력해주세요.');
      return;
    }

    checkPrevPassWordMutation.mutate(passwordForm.prevPassword);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        placement="center"
        size="sm"
        classNames={{ base: 'max-w-sm' }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">비밀번호 변경</ModalHeader>
              {passwordMissMatch && checkPrevPW ? (
                <p className="text-xs text-red-500 text-center">비밀번호 일치하지 않습니다.</p>
              ) : null}
              <ModalBody>
                {!checkPrevPW ? (
                  <PasswordFields
                    passwordLabel="현재 비밀번호"
                    passwordPlaceholder="현재 비밀번호를 입력하세요"
                    passwordName="prevPassword"
                    passwordValue={passwordForm.prevPassword}
                    onChange={handleChange}
                    showHint={false}
                  />
                ) : (
                  <PasswordFields
                    withConfirm
                    passwordLabel="새 비밀번호"
                    confirmLabel="새 비밀번호 확인"
                    passwordPlaceholder="새 비밀번호를 입력하세요"
                    confirmPlaceholder="새 비밀번호를 다시 입력하세요"
                    passwordName="newPassword"
                    confirmName="confirmPassword"
                    passwordValue={passwordForm.newPassword}
                    confirmValue={passwordForm.confirmPassword}
                    onChange={handleChange}
                    showHint
                    className={passwordMissMatch ? 'border-red-600' : ''}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <ButtonComponent type="button" variant="danger" size="xs" label="닫기" onClick={handleClose} />
                {!checkPrevPW ? (
                  <ButtonComponent
                    type="button"
                    variant="primary"
                    size="xs"
                    label="현재 비밀번호 확인"
                    onClick={handleCheckPrevPassWord}
                    isLoading={checkPrevPassWordMutation.isPending}
                    loadingText="확인중..."
                  />
                ) : (
                  <ButtonComponent
                    type="button"
                    variant="primary"
                    size="xs"
                    label="재설정"
                    onClick={handleSaveNewPassWord}
                    isLoading={changePassWordMutation.isPending}
                    loadingText="변경중..."
                  />
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ButtonComponent type="button" label="변경" variant="outline" size="xs" onClick={handleOpen} />
    </>
  );
};

export default ChangePassWord;
