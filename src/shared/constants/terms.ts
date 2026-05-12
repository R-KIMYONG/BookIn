import type { TermsConsentItem } from '@/shared/domain/terms/types';

export const TERMS_ITEMS: TermsConsentItem[] = [
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
];
