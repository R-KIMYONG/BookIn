'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Switch } from '@headlessui/react';

export default function TermsPage() {
  const router = useRouter();

  const [terms, setTerms] = useState({
    all: false,
    isOver14: false,
    agreedToTerms: false,
    agreedToMarketing: false
  });

  const handleSingleChange = (key: keyof typeof terms, value: boolean) => {
    const updated = { ...terms, [key]: value };
    const allAgreed = updated.isOver14 && updated.agreedToTerms && updated.agreedToMarketing;
    updated.all = allAgreed;

    setTerms(updated);
  };

  const handleAllChange = (checked: boolean) => {
    setTerms({
      isOver14: checked,
      agreedToTerms: checked,
      agreedToMarketing: checked,
      all: checked
    });
  };

  const termsConsentItems = [
    {
      id: 'isOver14',
      label: '(필수) 만 14세 이상입니다.',
      required: true
    },
    {
      id: 'agreedToTerms',
      label: (
        <>
          <Link href="/terms_of_use" target="_blank" className="text-blue-500 underline">
            (필수) 서비스 이용약관
          </Link>
          에 동의합니다.
        </>
      ),
      required: true
    },
    {
      id: 'agreedToMarketing',
      label: (
        <>
          <Link href="/marketing" target="_blank" className="text-blue-500 underline">
            (선택) 마케팅 수신
          </Link>
          에 동의합니다.
        </>
      ),
      required: false
    }
  ];

  //   setAllChecked(checked);
  //   setIsOver14(checked);
  //   setAgreedToTerms(checked);
  //   setAgreedToMarketing(checked);
  // };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!terms.isOver14 || !terms.agreedToTerms) {
      return toast.error('필수 약관에 모두 동의해 주세요!');
    }

    toast.success('약관 동의 완료!');
    router.push('/signup'); // 회원가입 페이지로 이동
  };
  const isNextButton = terms.isOver14 && terms.agreedToTerms;
  return (
    <div className="bg-white flex justify-center items-center flex-col min-h-screen h-full mt-[-20px] mb-[50px] text-sm">
      <div className="border border-inherit rounded-md shadow-lg w-80 py-5">
        <form className="flex justify-center items-center flex-col text-center h-full">
          <div className="absolute mb-[390px]"></div>
          <h1 className="mt-2 text-lg">약관 동의</h1>
          <div className="flex flex-col items-start my-2">
            <div className="flex items-center my-2 gap-2">
              <Switch
                checked={terms.all}
                onChange={handleAllChange}
                className={`${terms.all ? 'bg-blue-600' : 'bg-gray-300'}
                relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
              >
                <span
                  className={`${
                    terms.all ? 'translate-x-5' : 'translate-x-0'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                />
              </Switch>
              <label htmlFor="allChecked">모두 동의합니다</label>
            </div>
            <hr className="w-full border-gray-300 my-2" />

            {termsConsentItems.map(({ id, label }) => (
              <div key={id} className="flex items-center my-2 gap-2">
                <Switch
                  checked={terms[id as keyof typeof terms]}
                  onChange={(checked: boolean) => handleSingleChange(id as keyof typeof terms, checked)}
                  className={`${
                    terms[id as keyof typeof terms] ? 'bg-blue-600' : 'bg-gray-300'
                  } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      terms[id as keyof typeof terms] ? 'translate-x-5' : 'translate-x-0'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                  />
                </Switch>
                <label htmlFor={id}>{label}</label>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-[#af5858] my-4 rounded-full text-white text-sm py-1 px-6"
            >
              이전
            </button>
            <button
              disabled={!isNextButton}
              className={`my-4 rounded-full text-white text-sm py-1 px-6 ${
                isNextButton ? 'bg-[#af5858] cursor-pointer' : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}
              onClick={handleSubmit}
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
