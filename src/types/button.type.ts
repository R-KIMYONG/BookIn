export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'|'navbarLight'|'navbarDark';
 
//  primary   : 가장 중요한 주요 액션 (저장, 제출, 결제 등)
//  secondary : 보조 액션 (취소, 뒤로가기 등)
//  danger    : 위험 액션 (삭제, 탈퇴 등)
//  ghost     : 최소 강조 액션 (리스트 내부 버튼 등)
//  outline   : 중간 강조, 경계형,변경 버튼
//  navbarLight : 헤더 밝은 버전
//  navbarDark : 헤더 어두운 버전

type ButtonSize = 'xs' | 'sm' | 'md';


export type ButtonComponentProps = React.ComponentPropsWithoutRef<'button'> & {
  label?: React.ReactNode; 
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  loadingText?: React.ReactNode 
};


type SocialProvider = 'google' | 'github' | 'kakao';

export type SocialConfig = {
  name: SocialProvider;
  label: string;
  icon: React.ReactNode;
};