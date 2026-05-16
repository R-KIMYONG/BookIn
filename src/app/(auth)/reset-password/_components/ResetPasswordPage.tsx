'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordFields from '@/components/form/PasswordFields';
import Button from '@/components/common/ui/Button';
import { isValidPassword } from '@/shared/utils/validation/isPassword';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import ConfirmModal from '@/components/modal/ConfirmModal';
import useUrlParams from '@/hooks/url/useUrlParams';
import { useResetPassword } from '@/hooks/auth/useResetPassword';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { getParams } = useUrlParams();

  const token = getParams('token') ?? '';

  const [passwordForm, setPasswordForm] = useState<{ newPassword: string; confirmPassword: string }>({
    newPassword: '',
    confirmPassword: '',
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const { validateQuery, confirmMutation, cancelMutation } = useResetPassword(token);

  const passwordMissMatch =
    passwordForm.confirmPassword.length > 0 && passwordForm.newPassword !== passwordForm.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { newPassword, confirmPassword } = passwordForm;

    if (!newPassword.trim()) {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_PASSWORD);
      return;
    }

    if (!confirmPassword.trim()) {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_CONFIRM_PASSWORD);
      return;
    }

    if (!isValidPassword(newPassword)) {
      showToast(RESULT_CODE.VALIDATION_INVALID_PASSWORD);
      return;
    }

    try {
      await toastMutationPromise(confirmMutation.mutateAsync(newPassword), { pending: '비밀번호 재설정중...' });
    } catch (error) {
      console.error(error);
      showToast(RESULT_CODE.COMMON_SERVER_ERROR);
    }
  };

  const handleCancel = async () => {
    if (!token) return;

    try {
      await toastMutationPromise(cancelMutation.mutateAsync(), { pending: '요청 취소 중...' });
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast(RESULT_CODE.COMMON_SERVER_ERROR);
    }
  };

  const isValid =
    !!passwordForm.newPassword &&
    !!passwordForm.confirmPassword &&
    isValidPassword(passwordForm.newPassword) &&
    passwordForm.newPassword === passwordForm.confirmPassword;

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) return null;

  if (validateQuery.isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-gray-500">유효성 확인 중...</p>
      </div>
    );
  }

  if (validateQuery.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-red-500">서버 오류가 발생했습니다. 다시 시도해주세요.</p>
      </div>
    );
  }

  if (!validateQuery.data?.valid) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-sm text-gray-600">링크가 만료되었거나 유효하지 않습니다.</p>

        <Button label="비밀번호 재요청" onClick={() => router.replace('/forgot-password')} />

        <Button label="로그인으로" variant="secondary" onClick={() => router.replace('/login')} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <div className="px-6 py-7 sm:px-7 sm:py-8">
            <h1 className="text-lg font-bold text-gray-900 mb-2">비밀번호 재설정</h1>

            <p className="text-xs text-gray-500 mb-6">새로운 비밀번호를 입력해주세요.</p>
            {passwordMissMatch && <p className="text-xs text-red-500 text-center">비밀번호가 일치하지 않습니다.</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <PasswordFields
                withConfirm
                passwordName="newPassword"
                confirmName="confirmPassword"
                showHint
                passwordValue={passwordForm.newPassword}
                confirmValue={passwordForm.confirmPassword}
                onChange={handleChange}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  label="취소"
                  onClick={() => {
                    setIsCancelModalOpen(true);
                  }}
                  disabled={cancelMutation.isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  label="비밀번호 재설정"
                  isLoading={confirmMutation.isPending}
                  loadingText="변경중..."
                  disabled={!isValid}
                />
              </div>
            </form>

            <p className="text-[11px] text-gray-400 mt-5 text-center">
              보안을 위해 기존 비밀번호는 재사용할 수 없습니다.
            </p>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="비밀번호 재설정 취소"
        message={`진행 중인 비밀번호 재설정 요청을 취소하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="취소하기"
        cancelLabel="닫기"
        confirmColor="danger"
        isLoading={cancelMutation.isPending}
        onConfirm={handleCancel}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};

export default ResetPasswordPage;
