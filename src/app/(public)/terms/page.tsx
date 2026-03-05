'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Switch } from '@headlessui/react';
import { TermsConsentItem, TermsState } from '@/types/terms.type';
import ButtonComponent from '@/components/common/ButtonComponent';


export default function TermsPage() {
  const router = useRouter();

  const [terms, setTerms] = useState<Record<TermsState, boolean>>({
    all: false,
    isOver14: false,
    agreedToTerms: false,
    agreedToMarketing: false,
  });
  const requiredAgreed = terms.isOver14 && terms.agreedToTerms;
  const isNextButton = requiredAgreed;

  const handleSingleChange = (key: Exclude<TermsState, 'all'>, value: boolean) => {
    setTerms((prev) => {
      const updated = { ...prev, [key]: value };

      const allRequired = updated.isOver14 && updated.agreedToTerms;
      updated.all = allRequired;

      return updated;
    });
  };

  const termsConsentItems = useMemo<TermsConsentItem[]>(
    () => [
      {
        id: 'isOver14',
        title: '만 14세 이상입니다.',
        required: true,
        href: null,
      },
      {
        id: 'agreedToTerms',
        title: '서비스 이용약관',
        required: true,
        href: '/terms_of_use',
      },
      {
        id: 'agreedToMarketing',
        title: '마케팅 수신 동의',
        required: false,
        href: '/marketing',
      },
    ],
    []
  );

  const handleAllChange = (checked: boolean) => {
    setTerms({
      isOver14: checked,
      agreedToTerms: checked,
      agreedToMarketing: checked,
      all: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!terms.isOver14 || !terms.agreedToTerms) {
      return toast.error('필수 약관에 모두 동의해 주세요!');
    }

    toast.success('약관 동의 완료!');
    router.push('/signup'); // 회원가입 페이지로 이동
  };
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-[460px]">
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

                <Switch
                  checked={terms.all}
                  onChange={handleAllChange}
                  className={`${
                    terms.all ? 'bg-[#af5858]' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none items-center`}
                >
                  <span
                    className={`${
                      terms.all ? 'translate-x-5' : 'translate-x-0'
                    } inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
                  />
                </Switch>
              </div>
            </div>

            {/* 항목 리스트 */}
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
              {termsConsentItems.map((item) => {
                const checked = terms[item.id];

                return (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
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

                    <Switch
                      checked={checked}
                      onChange={(v) => handleSingleChange(item.id, v)}
                      className={`${
                        checked ? 'bg-[#af5858]' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none items-center`}
                    >
                      <span
                        className={`${
                          checked ? 'translate-x-5' : 'translate-x-0'
                        } inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
                      />
                    </Switch>
                  </div>
                );
              })}
            </div>

            {/* 하단 안내 */}
            <p className="mt-4 text-[11px] text-gray-400">선택 항목에 동의하지 않아도 서비스 이용은 가능합니다.</p>

            {/* 버튼 */}
            <div className="mt-6 flex gap-3">
              <ButtonComponent
                type="button"
                variant="outline"
                size="md"
                className="flex-1 rounded-xl"
                onClick={() => router.back()}
                label="이전"
              />

              <ButtonComponent
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 rounded-xl"
                disabled={!isNextButton}
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
}
