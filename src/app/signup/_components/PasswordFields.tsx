'use client';

import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon';
import { useState } from 'react';

export default function PasswordFields() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#af5858] focus:ring-4 focus:ring-[#af5858]/15';

  const iconBtn = 'absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center text-gray-400 hover:text-gray-600';

  return (
    <>
      {/* Password */}
      <div className="mb-3">
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-gray-700">
          Password
        </label>

        <div className="relative">
          <input
            className={inputBase}
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          <button type="button" className={iconBtn} onClick={() => setShowPw((v) => !v)} aria-label="비밀번호 보기">
            {showPw ? <EyeFilledIcon size={18} /> : <EyeSlashFilledIcon size={18} />}
          </button>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">8자 이상 / 영문+숫자+특수문자 포함</p>
      </div>

      {/* Confirm Password */}
      <div className="mb-1">
        <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-gray-700">
          Confirm Password
        </label>

        <div className="relative">
          <input
            className={inputBase}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="비밀번호 다시 입력"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className={iconBtn}
            onClick={() => setShowConfirm((v) => !v)}
            aria-label="비밀번호 확인 보기"
          >
            {showConfirm ? <EyeFilledIcon size={18} /> : <EyeSlashFilledIcon size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
