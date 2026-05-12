'use client';

import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon';
import { PasswordFieldsProps } from '@/components/form/PasswordFields/types';
import { useState } from 'react';
import Button from '../../common/ui/Button';
import cn from '@/shared/utils/cn';

const PasswordFields = ({
  withConfirm = false, //비밀번호 확인하는 필드 렌더링할지 여부 (로그인에서는 false)
  passwordLabel = 'Password',
  confirmLabel = 'Confirm Password',
  passwordPlaceholder = '••••••••',
  confirmPlaceholder = '비밀번호 다시 입력',
  passwordName = 'password',
  confirmName = 'confirmPassword',
  required = true, //브라우저 자동 제출 방지
  showHint = true, //비밀번호 규칙 렌더링여부
  className,
  passwordValue,
  confirmValue,
  onChange,
}: PasswordFieldsProps) => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15';

  const iconBtn = 'absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center text-gray-400 hover:text-gray-600';

  return (
    <>
      <div>
        <label htmlFor={passwordName} className="mb-1.5 block text-xs font-semibold text-gray-700">
          {withConfirm && <span className="ml-1 text-red-500">*</span>}
          {passwordLabel}
        </label>

        <div className="relative">
          <input
            className={cn(inputBase, className)}
            id={passwordName}
            name={passwordName}
            type={showPw ? 'text' : 'password'}
            placeholder={passwordPlaceholder}
            autoComplete={withConfirm ? 'new-password' : 'current-password'}
            required={required}
            {...(passwordValue !== undefined ? { value: passwordValue } : {})}
            {...(onChange ? { onChange } : {})}
          />
          <Button
            type="button"
            className={iconBtn}
            variant="ghost"
            onClick={() => setShowPw((password) => !password)}
          >
            {showPw ? <EyeFilledIcon size={18} /> : <EyeSlashFilledIcon size={18} />}
          </Button>
        </div>

        {showHint ? <p className="my-1 text-[11px] text-gray-400">8자 이상 / 영문+숫자+특수문자 포함</p> : null}
      </div>

      {/* 비밀번호 컨펌필드 */}
      {withConfirm ? (
        <div className="mb-1">
          <label htmlFor={confirmName} className="mb-1.5 block text-xs font-semibold text-gray-700">
            <span className="ml-1 text-red-500">*</span>
            {confirmLabel}
          </label>

          <div className="relative">
            <input
              className={cn(inputBase, className)}
              id={confirmName}
              name={confirmName}
              type={showConfirm ? 'text' : 'password'}
              placeholder={confirmPlaceholder}
              autoComplete="new-password"
              required={required}
              {...(confirmValue !== undefined ? { value: confirmValue } : {})}
              {...(onChange ? { onChange } : {})}
            />
            <Button
              type="button"
              className={iconBtn}
              variant="ghost"
              onClick={() => setShowConfirm((confirmPassword) => !confirmPassword)}
            >
              {showConfirm ? <EyeFilledIcon size={18} /> : <EyeSlashFilledIcon size={18} />}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PasswordFields;
