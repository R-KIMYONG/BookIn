'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import Button from '@/components/common/ui/Button';
import { isValidEmail } from '@/shared/utils/validation/isEmail';
import { toast } from 'react-toastify';
import CountdownStatus from '@/app/(private)/mypage/settings/_components/CountdownStatus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { usePathname, useRouter } from 'next/navigation';
import { RESEND_COOLDOWN_MS, RESET_PASSWORD_EXPIRES_MS } from '@/shared/constants/auth';
import { SECOND } from '@/shared/constants/time';
import { requestPasswordReset } from '@/shared/lib/auth/requestPasswordReset';
import { authKeys } from '@/shared/domain/auth/queryKeys';
import { AuthResetPasswordRequest } from '@/shared/domain/auth/types';
import useUrlParams from '@/hooks/url/useUrlParams';

type PasswordResetState = {
  pendingEmail: string | null;
  expireAt: number | null;
};
const ForgotPasswordPage = () => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { getParams } = useUrlParams();
  const pathName = usePathname();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      const { data, error } = await supabase
        .from('users')
        .select('password_reset_email, password_reset_expires_at')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return {
        pendingEmail: data?.password_reset_email ?? null,
        expireAt: data?.password_reset_expires_at ? new Date(data.password_reset_expires_at).getTime() : null,
      };
    },
  });

  const isExpired = !!data?.expireAt && now >= data.expireAt;

  const state: AuthResetPasswordRequest = !data?.pendingEmail ? 'idle' : isExpired ? 'expired' : 'pending';

  const requestTime = data?.expireAt ? data.expireAt - RESET_PASSWORD_EXPIRES_MS : null;

  const remainMs = requestTime ? Math.max(0, RESEND_COOLDOWN_MS - (now - requestTime)) : 0;

  const remainSec = Math.ceil(remainMs / 1000);
  const canRetry = remainMs === 0;

  const displayEmail = data?.pendingEmail || email || inputEmail;

  const handleSend = async () => {
    const trimmed = inputEmail.trim();

    if (!trimmed) {
      toast.warning('이메일을 입력해주세요.');
      return;
    }

    if (!isValidEmail(trimmed)) {
      toast.warning('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await toastMutationPromise(resetPasswordMutation.mutateAsync(trimmed), { pending: '비밀번호 변경요청중...' });
    } catch (error) {
      console.error(error);
      toast.error('요청 중 오류가 발생했습니다.');
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

  if (state === 'expired') {
    return (
      <Wrapper>
        <p className="text-sm text-gray-700">
          <b>{displayEmail}</b> 의 재설정 링크가 만료되었습니다.
        </p>

        <div className="mt-4 flex justify-end">
          <Button label="다시 요청" onClick={handleRetry} disabled={!canRetry} />
        </div>
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
        <Button label={canRetry ? '재요청' : `재요청 (${remainSec}s)`} onClick={handleRetry} disabled={!canRetry} />
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
  <Button type="submit" label={loading ? '전송 중...' : '재설정 메일 보내기'} />
);
