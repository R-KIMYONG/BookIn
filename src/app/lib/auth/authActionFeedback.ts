// 계정관련 오류메시지 출력 필드
export const AUTH_CODE = {
  login: {
    EMPTY: 'login-empty', // 이메일 또는 비밀번호 입력값이 비어 있음 (클라이언트 validation 실패)
    INVALID: 'login-invalid', // 이메일/비밀번호 조합이 잘못됨 (Supabase auth 실패)
    UNAUTHORIZED: 'login-unauthorized', //// 인증되지 않은 상태에서 보호된 페이지 접근 (세션 없음 또는 만료)
  },
  logout: {
    FAILED: 'logout-failed', //로그아웃 실패
    SUCCESS: 'logout-success', //로그아웃 성공
  },
  signup: {
    EMPTY: 'signup-empty', //필수 입력값 누락
    EMAIL_INVALID: 'signup-email-invalid', //이메일 형식 틀림
    PASSWORD_INVALID: 'signup-password-invalid', //비밀번호 형식 틀림(정책에 안맞음)
    PASSWORD_MISMATCH: 'signup-password-mismatch', // 비밀번호와 컨펌빔리번호 일치하지않음
    EMAIL_EXISTS: 'signup-email-exists', //이미 존재하는 이메일
    NICKNAME_EXISTS: 'signup-nickname-exists', //이미 존재하는 닉네임
    AUTH_FAILED: 'signup-auth-failed', //auth테이블에 signup 실패
    PROFILE_FAILED: 'signup-profile-failed', //public users테이블에 insert 실패
  },
  delete: {
    USER_FAILED: 'delete-user-failed', //public users삭제 실패
    AUTH_FAILED: 'delete-auth-failed', //auth 테이블 users 삭제 실패(rpc가 문제임)
    SUCCESS: 'delete-success', //탈퇴 성공
  },
  common: {
    UNKNOWN: 'unknown', //정의되지않는 오류
  },
} as const;

export const AUTH_FEEDBACK_TEXT = {
  // login
  'login-empty': '이메일과 비밀번호를 입력해주세요.',
  'login-invalid': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'login-unauthorized': '로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.',

  // logout
  'logout-failed': '로그아웃 중 문제가 발생했습니다.',
  'logout-success': '로그아웃되었습니다.',

  // signup
  'signup-empty': '빈칸을 모두 채워주세요.',
  'signup-email-invalid': '유효한 이메일 주소를 입력해주세요.',
  'signup-password-invalid': '비밀번호는 8자 이상이며 영문/숫자/특수문자를 포함해야 합니다.',
  'signup-password-mismatch': '비밀번호 확인이 일치하지 않습니다.',
  'signup-email-exists': '이미 사용 중인 이메일입니다.',
  'signup-nickname-exists': '이미 사용 중인 닉네임입니다.',
  'signup-auth-failed': '회원가입에 실패했습니다.',
  'signup-profile-failed': '회원 정보 저장 중 문제가 발생했습니다.',

  // delete
  'delete-user-failed': '회원 정보를 삭제하는 중 오류가 발생했습니다.',
  'delete-auth-failed': '계정 삭제를 완료하지 못했습니다.',
  'delete-success': '회원탈퇴가 완료되었습니다.',

  // common
  unknown: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
} as const;
