'use client';

import ButtonComponent from '@/components/common/ButtonComponent';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast, Id } from 'react-toastify';

const ChangeUserId = ({ info }: { info: string }): React.JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const isCooldown = Date.now() < cooldownUntil;
  const cooldownSec = Math.ceil((cooldownUntil - Date.now()) / 1000);
  const [, forceTick] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [draftEmail, setDraftEmail] = useState<string>(info); // 인풋에 입력중인 이메일을 의미
  const [pendingEmail, setPendingEmail] = useState<string | null>(null); // 인증대기중 이메일
  const emailRegex = useMemo<RegExp>(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);
  const pendingToastIdRef = useRef<Id | null>(null);
  const isEmail = useCallback<(checkEmail: string) => boolean>(
    (checkEmail: string) => {
      return emailRegex.test(checkEmail);
    },
    [emailRegex]
  );

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const showPendingToast = () => {
    const id = toast.success('인증메일 발송완료. 메일 내 링크 클릭 후 이메일 변경 완료됩니다.', {
      position: 'top-right',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });
    pendingToastIdRef.current = id;
  };

  const clearPendingToast = () => {
    const id = pendingToastIdRef.current;
    if (id != null) toast.dismiss(id);
    pendingToastIdRef.current = null;
  };

  const handleSave = async (): Promise<void> => {
    if (isSaving) return;
    if (isCooldown) {
      toast.warning(`잠시 후 다시 시도해주세요. (${cooldownSec}s)`, { position: 'top-right' });
      return;
    }

    if (draftEmail.trim() === '') {
      toast.warning(`빈칸으로 변경할 수 없습니다.`, {
        position: 'top-right',
      });
      return;
    }
    if (!isEmail(draftEmail)) {
      toast.warning('이메일 형식이 아닙니다.', { position: 'top-right' });
      return;
    }

    try {
      setIsSaving(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast.error('세션이 만료되었습니다. 다시 로그인 해주세요.', { autoClose: false });
        return;
      }

      if (isEmail(draftEmail)) {
        const { data: existingUser, error: dupError } = await supabase
          .from('users')
          .select('id,email')
          .eq('email', draftEmail)
          .maybeSingle();
        if (existingUser) {
          toast.error(`변경사항 없거나 이미 사용 중인 이메일 주소입니다. 다른 이메일 주소를 입력해주세요.`, {
            position: 'top-right',
          });
          return;
        }

        if (dupError) {
          console.error('[dup check error]', dupError);
          toast.error(`중복 체크 실패: ${dupError.message}`, { autoClose: false });
          return;
        }

        const redirectTo = `${window.location.origin}/api/auth/email-callback`;
        const { error: authError } = await supabase.auth.updateUser(
          { email: draftEmail },
          { emailRedirectTo: redirectTo }
        );
        if (authError) {
          if (authError.message?.includes('only request this after')) {
            setCooldownUntil(Date.now() + 12_000);
            toast.warning(`잠시 후 다시 시도해주세요. (${12}초)`, { position: 'top-right' });
            return;
          }

          toast.error(`updateUser 실패: ${authError.message}`, { autoClose: false });
          return;
        }

        setPendingEmail(draftEmail);
        setIsEditing(false);
        showPendingToast();
      } else {
        toast.warning(`이메일 형식이 아닙니다.`, {
          position: 'top-right',
        });
        handleCancel();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`이메일 업데이트 중 오류 발생:`, error);
        toast.error(`이메일 업데이트 중 오류 발생했습니다.`, {
          position: 'top-right',
        });
      }
      console.error(`이메일 업데이트 중 예상치 못한 오류 발생:`, error);
      toast.error(`이메일 업데이트 중 예상치 못한 오류 발생했습니다.`, {
        position: 'top-right',
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDraftEmail(e.target.value);
    // draftEmail = e.target.value;
  };

  const handleCancel = () => {
    //변경 취소 클릭 시 원래 상태로 되돌림
    // draftEmail = originalInfoRef.current;
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isCooldown) return;
    const t = setInterval(() => forceTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [isCooldown]);

  useEffect(() => {
    const bc = new BroadcastChannel('bookin-auth');

    bc.onmessage = async (event) => {
      if (event.data?.type !== 'INVALIDATE_USERINFO') return;

      // 1) 서버에서 userInfo 다시 받아오게
      await queryClient.invalidateQueries({ queryKey: ['userInfo'] });

      // 2) pending UI 정리
      setPendingEmail(null);
      setIsEditing(false);

      // 3) “인증메일 발송” 토스트 계속 떠있으면 닫기
      clearPendingToast();

      // (선택) 성공 토스트
      toast.success('이메일 변경이 반영되었습니다.', { position: 'top-right' });
    };

    return () => bc.close();
  }, [queryClient]);

  return (
    <div className="flex items-center justify-between gap-4">
      {isEditing ? (
        <>
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
              placeholder={info}
              className="text-xs outline-dashed pl-2 py-1 rounded block box-border"
              onChange={handleChange}
              maxLength={25}
            />

            <ButtonComponent type="button" label="취소" variant="secondary" size="xs" onClick={handleCancel} />
            <ButtonComponent
              type="submit"
              size="xs"
              label={isSaving ? '요청중...' : isCooldown ? `대기 (${cooldownSec}s)` : '저장'}
              variant="primary"
              disabled={isSaving || isCooldown}
            />
          </form>
        </>
      ) : (
        <>
          <p className="text-xs">{info}</p>
          {pendingEmail && (
            <p className="text-[10px] text-default-500 mt-1">
              인증 대기중: <span className="font-semibold">{pendingEmail}</span>
            </p>
          )}
          <ButtonComponent type="button" label="변경" variant="outline" size="xs" onClick={handleEdit} />
        </>
      )}
    </div>
  );
};

export default ChangeUserId;
