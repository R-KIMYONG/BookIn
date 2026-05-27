'use client';

import Button from '@/components/common/ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { ReactElement, useMemo, useState } from 'react';
import CountdownStatus from './CountdownStatus';
import { isValidEmail } from '@/shared/utils/validation/isEmail';
import toastMutationPromise from '@/shared/lib/toast/toastMutationPromise';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import { userKeys } from '@/shared/domain/user/queryKeys';

type PendingEmailData = {
  pendingEmail: string;
  emailExpireAt: number | null;
};

const ChangeUserId = ({ email }: { email: string }): ReactElement => {
  const queryClient = useQueryClient();

  const [draftEmail, setDraftEmail] = useState<string>(''); // input에 수정중인 상태

  const {
    data: pendingData,
    isError,
    error,
    refetch,
  } = useQuery<PendingEmailData>({
    //조회이니까 컴포넌트에서 직접 supabase로 요청
    queryKey: userKeys.pendingEmail(),
    queryFn: async () => {
      const res = await fetch('/api/user/pending-email');

      if (!res.ok) {
        throw new Error('인증 상태 조회 실패');
      }

      return res.json();
    },
  });
  const now = Date.now();
  //인증 만료 상태
  const isExpired = !!pendingData?.emailExpireAt && now >= pendingData.emailExpireAt;
  //인증 대기 상태
  const isPendingValid = !!pendingData?.pendingEmail && !!pendingData?.emailExpireAt && !isExpired;

  const viewState: 'editable' | 'pending' | 'expired' = useMemo(() => {
    if (isPendingValid) return 'pending'; //지금 인증대기중임
    if (isExpired) return 'expired'; //지금 인증만료임
    return 'editable';
  }, [isPendingValid, isExpired]);

  const changeUserEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/user/email', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message ?? '이메일 변경 실패');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });

      queryClient.invalidateQueries({ queryKey: userKeys.pendingEmail() });
      setDraftEmail('');
    },
  });
  const isSaving = changeUserEmailMutation.isPending;
  const handleSave = async (): Promise<void> => {
    if (isSaving) return;

    const newEmail = draftEmail.trim();

    if (newEmail === email) {
      showToast(RESULT_CODE.AUTH_EMAIL_SAME_AS_CURRENT);
      return;
    }

    if (!newEmail) {
      showToast(RESULT_CODE.VALIDATION_REQUIRED_EMAIL);
      return;
    }

    if (!isValidEmail(newEmail)) {
      showToast(RESULT_CODE.VALIDATION_INVALID_EMAIL);
      return;
    }

    try {
      await toastMutationPromise(changeUserEmailMutation.mutateAsync(newEmail), { pending: '이메일변경 요청중...' });
    } catch (error) {
      console.error(error);
    }
  };

  const clearPendingEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/user/email', {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message ?? '인증 대기 상태 초기화 실패');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });

      queryClient.invalidateQueries({ queryKey: userKeys.pendingEmail() });
    },
  });

  //인증 대기 취소
  const handleCancelPending = async () => {
    try {
      await toastMutationPromise(clearPendingEmailMutation.mutateAsync(), { pending: '인증 대기 취소중...' });
    } catch (error) {
      console.error(error);
    }
  };

  //인증 재요청
  const handleRetry = async () => {
    if (!pendingData?.pendingEmail) return;
    try {
      await toastMutationPromise(changeUserEmailMutation.mutateAsync(pendingData.pendingEmail), {
        pending: '재요청중...',
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isError) {
    console.error(error);
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
        <p className="text-sm font-medium text-red-600">이메일 인증 상태를 불러오지 못했습니다.</p>
        <p className="mt-1 text-xs text-gray-500">네트워크 상태를 확인한 뒤 다시 시도해주세요.</p>
        <div className="mt-3 flex justify-end">
          <Button size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
        </div>
      </div>
    );
  }

  if (viewState === 'expired') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
          <CountdownStatus
            expireAt={pendingData?.emailExpireAt ?? null}
            label={`인증 대기중: ${pendingData?.pendingEmail}`}
            expiredText="인증 시간 만료"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" size="sm" label="취소" variant="secondary" onClick={handleCancelPending} />
          <Button type="button" size="sm" label="재요청" variant="primary" onClick={handleRetry} />
        </div>
      </div>
    );
  }

  if (viewState === 'pending') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <CountdownStatus
            expireAt={pendingData?.emailExpireAt ?? null}
            label={`인증 대기중: ${pendingData?.pendingEmail}`}
            expiredText="인증 시간 만료"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" size="sm" label="인증 취소" variant="secondary" onClick={handleCancelPending} />
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
          새 이메일
        </label>
        <input
          id="email"
          type="email"
          value={draftEmail}
          placeholder={email}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#AF5858]"
          onChange={(e) => setDraftEmail(e.target.value)}
          maxLength={40}
          autoComplete="off"
        />
        <p className="mt-2 text-xs text-gray-400">변경 요청 후 인증 메일을 통해 새 이메일을 확인해야 합니다.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          size="sm"
          label="이메일 변경"
          isLoading={changeUserEmailMutation.isPending}
          loadingText="요청중..."
          variant="primary"
        />
      </div>
    </form>
  );
};

export default ChangeUserId;
