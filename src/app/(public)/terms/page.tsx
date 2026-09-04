'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TermsState } from '@/shared/domain/terms/types';
import Button from '@/components/common/ui/Button';
import { TERMS_ITEMS } from '@/shared/constants/terms';
import { showToast } from '@/shared/lib/message/showToast';
import { RESULT_CODE } from '@/shared/lib/message/resultCode';
import SwitchToggle from './_components/SwitchToggle';

const TermsPage = () => {
  const router = useRouter();

  const [terms, setTerms] = useState<Record<TermsState, boolean>>({
    isOver14: false,
    agreedToTerms: false,
    agreedToMarketing: false,
  });
  const canProceed = terms.isOver14 && terms.agreedToTerms;

  const isAllChecked = terms.isOver14 && terms.agreedToTerms && terms.agreedToMarketing;

  const handleSingleChange = (key: TermsState, value: boolean) => {
    setTerms((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAllChange = (checked: boolean) => {
    setTerms((prev) => ({
      ...prev,
      isOver14: checked,
      agreedToTerms: checked,
      agreedToMarketing: checked,
    }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canProceed) {
      showToast(RESULT_CODE.TERMS_REQUIRED_AGREEMENT);
      return;
    }
    router.push('/signup'); // 회원가입 페이지로 이동
  };
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-[460px] py-4">
        <div className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <form onSubmit={handleSubmit} className="p-6 sm:p-7">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">약관 동의</h1>
              <p className="mt-1 text-xs text-gray-500">
                서비스 이용을 위해 <span className="font-semibold">필수 항목</span>에 동의해주세요.
              </p>
            </div>

            {/* 전체 동의 */}
            <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">모두 동의</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">필수 및 선택 항목을 한 번에 설정합니다.</p>
                </div>
                <SwitchToggle checked={isAllChecked} onChange={() => handleAllChange(!isAllChecked)} />
              </div>
            </div>

            {/* 항목 리스트 */}
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
              {TERMS_ITEMS.map((item) => {
                const checked = terms[item.id];

                return (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex whitespace-nowrap items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            item.required ? 'bg-[#af5858]/10 text-[#af5858]' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.required ? '필수' : '선택'}
                        </span>

                        <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
                      </div>

                      {item.href ? (
                        <Link
                          href={item.href}
                          target="_blank"
                          className="mt-1 inline-flex text-[11px] font-semibold text-gray-500 hover:text-[#af5858] hover:underline"
                        >
                          내용 보기
                        </Link>
                      ) : (
                        <p className="mt-1 text-[11px] text-gray-500">가입 연령 요건을 확인합니다.</p>
                      )}
                    </div>
                    <SwitchToggle checked={checked} onChange={() => handleSingleChange(item.id, !checked)} />
                  </div>
                );
              })}
            </div>

            {/* 하단 안내 */}
            <p className="mt-4 text-[11px] text-gray-400">선택 항목에 동의하지 않아도 서비스 이용은 가능합니다.</p>

            {/* 버튼 */}
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="flex-1 rounded-xl"
                onClick={() => router.back()}
                label="이전"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 rounded-xl"
                disabled={!canProceed}
                isLoading={false}
                label="다음"
              />
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};
export default TermsPage;
