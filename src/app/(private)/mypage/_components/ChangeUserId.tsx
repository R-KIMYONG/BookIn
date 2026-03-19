'use client';

import ButtonComponent from '@/components/common/ButtonComponent';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PendingEmailCountdown from './PendingEmailCountdown';
import { createClient } from '@/utils/supabase/client';
import { isValidEmail } from '@/app/lib/validation/isEmail';
import { ActionButtons, PendingEmailData } from '@/types/changeUserId.type';
import toastMutationPromise from '@/app/lib/toast/toastMutationPromise';

const ChangeUserId = ({ email, userId }: { email: string; userId: string }): React.JSX.Element => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [hasExpired, setHasExpired] = useState<boolean>(false); //인증시간 만료여부 상태

  const [isEditing, setIsEditing] = useState<boolean>(false); // 편집상태로 전환여부 상태

  const [draftEmail, setDraftEmail] = useState<string>(''); // input에 수정중인 상태

  const {
    data: pendingData,
    isError,
    error,
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

  const viewState: 'editing' | 'pending' | 'expired' | 'default' = useMemo(() => {
    if (isEditing) return 'editing'; //지금 편집중임
    if (isPendingValid) return 'pending'; //지금 인증대기중임
    if (isExpired) return 'expired'; //지금 인증만료임
    return 'default';
  }, [isEditing, isPendingValid, isExpired]);

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
      queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
      queryClient.invalidateQueries({ queryKey: ['pendingEmail', userId] });
      setDraftEmail('');
      setIsEditing(false);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingEmail', userId] });
      queryClient.invalidateQueries({ queryKey: ['userInfo', userId] });
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
  //편집 취소
  const handleCancelEdit = () => {
    setDraftEmail('');
    setIsEditing(false);
  };

  //편집 시작
  const handleOpenEdit = () => {
    setIsEditing(true);
    setDraftEmail('');
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

  const getActionButtons = (): ActionButtons => {
    switch (viewState) {
      case 'pending':
        return [
          {
            key: 'cancel-pending',
            label: '인증 취소',
            variant: 'secondary' as const,
            type: 'button' as const,
            disabled: false,
            onClick: handleCancelPending,
          },
          {
            key: 'pending-status',
            label: '인증 대기중',
            variant: 'outline' as const,
            type: 'button' as const,
            disabled: true,
            onClick: handleOpenEdit,
          },
        ];

      case 'expired':
        return [
          {
            key: 'cancel-expired',
            label: '취소',
            variant: 'secondary' as const,
            type: 'button' as const,
            disabled: false,
            onClick: handleCancelPending,
          },
          {
            key: 'retry',
            label: '재요청',
            variant: 'primary' as const,
            type: 'button' as const,
            disabled: false,
            onClick: handleRetry,
          },
        ];

      default:
        return [
          {
            key: 'edit',
            label: '변경',
            variant: 'outline' as const,
            type: 'button' as const,
            disabled: false,
            onClick: handleOpenEdit,
          },
        ];
    }
  };
  const actionButtons = getActionButtons();

  useEffect(() => {
    if (isError) {
      console.error(error);
    }
  }, [isError, error]);

  //인증대기 시간 만료될경우 UI변경용 상태 업데이트
  useEffect(() => {
    setHasExpired(false);
  }, [pendingData?.pendingEmail, pendingData?.emailExpireAt]);

  if (viewState === 'editing') {
    return (
      <form
        className="flex gap-2"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <input
          type="text"
          value={draftEmail}
          placeholder={email}
          className="text-xs outline-dashed pl-2 py-1 rounded block box-border"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setDraftEmail(e.target.value);
          }}
          maxLength={25}
          autoComplete="off"
        />

        <ButtonComponent type="button" label="취소" variant="secondary" size="xs" onClick={handleCancelEdit} />
        <ButtonComponent
          type="submit"
          size="xs"
          label={isSaving ? '요청중...' : '저장'}
          variant="primary"
          disabled={isSaving}
        />
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col items-start gap-1">
        <p className="text-xs">{email}</p>
        {(viewState === 'pending' || viewState === 'expired') && (
          <PendingEmailCountdown
            email={pendingData?.pendingEmail}
            expireAt={pendingData?.emailExpireAt ?? null}
            onExpiredChange={setHasExpired}
          />
        )}
      </div>
      <div className="flex shrink-0 gap-2 items-center">
        {actionButtons.map((item) => {
          return (
            <ButtonComponent
              key={item.key}
              type={item.type}
              size="xs"
              label={item.label}
              variant={item.variant}
              disabled={item.disabled}
              onClick={item.onClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChangeUserId;
