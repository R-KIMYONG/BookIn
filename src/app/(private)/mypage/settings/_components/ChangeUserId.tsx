'use client';

import ButtonComponent from '@/components/common/ui/ButtonComponent';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PendingEmailCountdown from './PendingEmailCountdown';
import { createClient } from '@/utils/supabase/client';
import { isValidEmail } from '@/app/lib/validation/isEmail';
import { PendingEmailData } from '@/types/changeUserId.type';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';

const ChangeUserId = ({ email, userId }: { email: string; userId: string }): ReactElement => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [hasExpired, setHasExpired] = useState<boolean>(false); //인증시간 만료여부 상태

  const [draftEmail, setDraftEmail] = useState<string>(''); // input에 수정중인 상태

  const {
    data: pendingData,
    isError,
    error,
    refetch,
  } = useQuery<PendingEmailData>({
    //조회이니까 컴포넌트에서 직접 supabase로 요청
    queryKey: ['pendingEmail', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('pending_email,pending_email_expires_at')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      const pendingEmail = data?.pending_email ?? '';
      const emailExpireAt = data?.pending_email_expires_at ? new Date(data.pending_email_expires_at).getTime() : null;
      return { pendingEmail, emailExpireAt };
    },
  });
  //인증 대기 상태
  const isPendingValid = !!pendingData?.pendingEmail && !!pendingData?.emailExpireAt && !hasExpired;
  //인증 만료 상태
  const isExpired = !!pendingData?.pendingEmail && !!pendingData?.emailExpireAt && hasExpired;

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
    onSuccess: (result) => {
      if (result?.user) {
        queryClient.setQueriesData({ queryKey: ['userInfo', userId] }, result.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['pendingEmail', userId] });
      setDraftEmail('');
    },
  });
  const isSaving = changeUserEmailMutation.isPending;
  const handleSave = async (): Promise<void> => {
    if (isSaving) return;

    const newEmail = draftEmail.trim();

    if (newEmail === email) {
      toast.info('현재 사용 중인 이메일입니다.', {
        position: 'top-right',
      });
      return;
    }

    if (!newEmail) {
      toast.warning('빈칸으로 변경할 수 없습니다.', {
        position: 'top-right',
      });
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.warning('이메일 형식이 아닙니다.', {
        position: 'top-right',
      });
      return;
    }

    try {
      await toastMutationPromise(changeUserEmailMutation.mutateAsync(newEmail), '이메일변경 요청중...');
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
    onSuccess: (result) => {
      if (result?.user) {
        queryClient.setQueriesData({ queryKey: ['userInfo', userId] }, result.user);
      } else {
        queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['pendingEmail', userId] });
    },
  });

  //인증 대기 취소
  const handleCancelPending = async () => {
    try {
      await toastMutationPromise(clearPendingEmailMutation.mutateAsync(), '인증 대기 취소중...');
    } catch (error) {
      console.error(error);
    }
  };

  //인증 재요청
  const handleRetry = async () => {
    if (!pendingData?.pendingEmail) return;
    try {
      await toastMutationPromise(changeUserEmailMutation.mutateAsync(pendingData.pendingEmail), '재요청중...');
    } catch (error) {
      console.error(error);
    }
  };
  //인증대기 시간 만료될경우 UI변경용 상태 업데이트
  useEffect(() => {
    setHasExpired(false);
  }, [pendingData?.pendingEmail, pendingData?.emailExpireAt]);

  if (isError) {
    console.error(error);
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
        <p className="text-sm font-medium text-red-600">이메일 인증 상태를 불러오지 못했습니다.</p>
        <p className="mt-1 text-xs text-gray-500">네트워크 상태를 확인한 뒤 다시 시도해주세요.</p>
        <div className="mt-3 flex justify-end">
          <ButtonComponent size="sm" variant="primary" label="다시 시도" onClick={() => refetch()} />
        </div>
      </div>
    );
  }

  if (viewState === 'expired') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
          <PendingEmailCountdown
            email={pendingData?.pendingEmail}
            expireAt={pendingData?.emailExpireAt ?? null}
            onExpiredChange={setHasExpired}
          />
        </div>

        <div className="flex justify-end gap-2">
          <ButtonComponent type="button" size="sm" label="취소" variant="secondary" onClick={handleCancelPending} />
          <ButtonComponent type="button" size="sm" label="재요청" variant="primary" onClick={handleRetry} />
        </div>
      </div>
    );
  }

  if (viewState === 'pending') {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <PendingEmailCountdown
            email={pendingData?.pendingEmail}
            expireAt={pendingData?.emailExpireAt ?? null}
            onExpiredChange={setHasExpired}
          />
        </div>

        <div className="flex justify-end">
          <ButtonComponent
            type="button"
            size="sm"
            label="인증 취소"
            variant="secondary"
            onClick={handleCancelPending}
          />
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
        <ButtonComponent
          type="submit"
          size="sm"
          label={changeUserEmailMutation.isPending ? '요청중...' : '이메일 변경'}
          variant="primary"
          disabled={changeUserEmailMutation.isPending}
        />
      </div>
    </form>
  );
};

export default ChangeUserId;
