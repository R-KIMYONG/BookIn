export type TermsState = 'isOver14' | 'agreedToTerms' | 'agreedToMarketing';
export type TermsKey = Exclude<TermsState, 'all'>;
export type TermsConsentItem = {
  id: TermsKey;
  title: string;
  required: boolean;
  href: string | null;
};
