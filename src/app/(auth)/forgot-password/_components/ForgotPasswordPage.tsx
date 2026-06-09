'use client';

import { ReactNode, useEffect, useState } from 'react';
import Button from '@/components/common/ui/Button';
import { isValidEmail } from '@/shared/utils/validation/isEmail';
import CountdownStatus from '@/app/(private)/mypage/settings/_components/CountdownStatus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { usePathname, useRouter } from 'next/navigation';
import { SECOND } from '@/shared/constants/time';
import { requestPasswordReset } from '@/shared/lib/auth/requestPasswordReset';
import { authKeys } from '@/shared/domain/auth/queryKeys';
import { AuthResetPasswordRequest } from '@/shared/domain/auth/types';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import RetryButton from './RetryButton';
import useNow from '@/hooks/common/useNow';
import useUrlParams from '@/hooks/url/useUrlParams';

type PasswordResetState = {
  pendingEmail: string | null;
  expireAt: number | null;
};
const ForgotPasswordPage = () => {
  const queryClient = useQueryClient();
  const { getParams } = useUrlParams();
  const pathName = usePathname();
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState<string>('');
  const email = getParams('email') ?? '';

  const resetPasswordMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.passwordReset(variables),
      });
      if (email !== variables) {
        const params = new URLSearchParams({ email: variables });
        router.replace(`${pathName}?${params}`);
      }
    },
  });

  const { data } = useQuery<PasswordResetState>({
    queryKey: authKeys.passwordReset(email),
    enabled: !!email,
    staleTime: 30 * SECOND,
    queryFn: async () => {
      const res = await fetch(`/api/auth/password-reset-status?email=${email}`);

      if (!res.ok) {
        throw new Error('조회 실패');
      }

      return res.json();
    },
  });
  const now = useNow({ enabled: true, interval: 1000, stopAt: data?.expireAt ?? null });

  const state: AuthResetPasswordRequest = !data?.pendingEmail ? 'idle' : 'pending';

  const displayEmail = data?.pendingEmail || email || inputEmail;

  const handleSend = async () => {
    const trimmed = inputEmail.trim();

    if (!trimmed) {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_EMAIL);
      return;
    }

    if (!isValidEmail(trimmed)) {
      showToast(RESULT_CODE.VALIDATION_INVALID_EMAIL);
      return;
    }

    try {
      await toastMutationPromise(resetPasswordMutation.mutateAsync(trimmed), { pending: '비밀번호 변경요청중...' });
    } catch (error) {
      console.error(error);
      showToast(RESULT_CODE.COMMON_UNKNOWN_ERROR);
    }
  };

  const handleRetry = async () => {
    const retryEmail = data?.pendingEmail ?? email;

    if (!retryEmail) return;

    try {
      await toastMutationPromise(resetPasswordMutation.mutateAsync(retryEmail), { pending: '재요청 중...' });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!data?.expireAt) return;
    if (now === null) return;

    if (now >= data.expireAt) {
      queryClient.invalidateQueries({
        queryKey: authKeys.passwordReset(email),
      });
    }
  }, [now, data?.expireAt, queryClient, email]);
  if (state === 'idle') {
    return (
      <Wrapper>
        <h1 className="text-lg font-bold mb-2">비밀번호 찾기</h1>
        <p className="text-xs text-gray-500 mb-5">가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.</p>
        <form
          onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input value={inputEmail} onChange={setInputEmail} disabled={resetPasswordMutation.isPending} />
          <SubmitButton loading={resetPasswordMutation.isPending} />
        </form>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 space-y-2">
        <p className="text-sm text-gray-700">
          <b>{displayEmail}</b> 로 메일이 발송되었습니다.
        </p>

        <p className="text-xs text-gray-500">메일의 링크를 클릭하여 비밀번호를 재설정해주세요.</p>

        <p className="text-xs text-gray-400">링크는 약 1시간 동안 유효합니다.</p>

        <CountdownStatus expireAt={data?.expireAt ?? null} label="남은 시간" expiredText="만료됨" />
      </div>

      <div className="mt-4 flex justify-end">
        <RetryButton expireAt={data?.expireAt ?? null} onRetry={handleRetry} />
      </div>
    </Wrapper>
  );
};

export default ForgotPasswordPage;

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] flex items-center justify-center px-4">
    <div className="w-full max-w-[420px]">
      <div className="rounded-2xl bg-white shadow p-6">{children}</div>
    </div>
  </div>
);

const Input = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => (
  <input
    type="email"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="you@example.com"
    disabled={disabled}
    className="w-full border px-4 py-3 my-2 rounded-xl"
  />
);

const SubmitButton = ({ loading }: { loading: boolean }) => (
  <Button type="submit" label="재설정 메일 보내기" isLoading={loading} loadingText="전송중..." />
);
