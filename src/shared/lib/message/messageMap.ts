import { ResultCode, RESULT_CODE } from './resultCode';
type MessageValue = string | ((variables?: Record<string, unknown>) => string);
type ToastMessageMap = {
  [key in ResultCode]: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: MessageValue;
  };
};

export const MESSAGE_MAP: ToastMessageMap = {
  //==========아이디변경==========
  [RESULT_CODE.AUTH_EMAIL_SAME_AS_CURRENT]: {
    type: 'info',
    message: '현재 사용 중인 이메일입니다.',
  },

  [RESULT_CODE.AUTH_NICKNAME_SAME_AS_CURRENT]: {
    type: 'info',
    message: '현재 사용 중인 닉네임입니다.',
  },

  //==========로그인==========
  [RESULT_CODE.AUTH_LOGIN_SUCCESS]: {
    type: 'success',
    message: '로그인되었습니다.',
  },
  [RESULT_CODE.AUTH_LOGIN_FAILED]: {
    type: 'error',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  [RESULT_CODE.AUTH_SESSION_EXPIRING_SOON]: {
    type: 'info',

    message: '5분 후 세션이 만료됩니다. 원하시면 지금 연장할 수 있어요.',
  },

  //==========로그아웃==========
  [RESULT_CODE.AUTH_LOGOUT_FAILED]: {
    type: 'error',
    message: '로그아웃에 실패되었습니다.',
  },
  [RESULT_CODE.AUTH_LOGOUT_SUCCESS]: {
    type: 'success',
    message: '로그아웃되었습니다.',
  },
  //==========비밀번호 리셋==========
  [RESULT_CODE.AUTH_RESET_PASSWORD_SUCCESS]: {
    type: 'success',
    message: '비밀번호가 변경되었습니다.',
  },

  //==========회원가입==========
  [RESULT_CODE.AUTH_SIGNUP_SUCCESS]: {
    type: 'success',
    message: '회원가입이 완료되었습니다.',
  },
  [RESULT_CODE.AUTH_SIGNUP_FAILED]: {
    type: 'error',
    message: '회원가입 중 오류가 발생했습니다.',
  },
  [RESULT_CODE.AUTH_EMAIL_ALREADY_EXISTS]: {
    type: 'error',
    message: '이미 가입된 이메일입니다.',
  },
  [RESULT_CODE.AUTH_NICKNAME_ALREADY_EXISTS]: {
    type: 'error',
    message: '이미 사용 중인 닉네임입니다.',
  },
  [RESULT_CODE.AUTH_AUTO_LOGIN_FAILED]: {
    type: 'error',
    message: '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 다시 로그인해주세요.',
  },
  //==========소셜로그인==========
  [RESULT_CODE.AUTH_SOCIAL_LOGIN_SUCCESS]: {
    type: 'success',
    message: (variables) => {
      const providerLabel = variables?.providerLabel;

      if (typeof providerLabel === 'string') {
        return `${providerLabel} 계정으로 로그인되었습니다.`;
      }

      return '소셜 로그인되었습니다.';
    },
  },
  [RESULT_CODE.AUTH_SOCIAL_LOGIN_FAILED]: {
    type: 'error',
    message: '소셜 로그인에 실패되었습니다.',
  },

  [RESULT_CODE.AUTH_DELETE_FAILED]: {
    type: 'error',
    message: '회원탈퇴 실패했습니다.',
  },
  [RESULT_CODE.AUTH_DELETE_SUCCESS]: {
    type: 'success',
    message: '회원탈퇴 성공했습니다.',
  },

  //==========validation==========
  [RESULT_CODE.VALIDATION_INVALID_EMAIL]: {
    type: 'warning',
    message: '올바른 이메일 형식이 아닙니다.',
  },

  [RESULT_CODE.VALIDATION_INVALID_PASSWORD]: {
    type: 'warning',
    message: '비밀번호는 8~12자리 영문, 숫자, 특수문자를 포함해야 합니다.',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_EMAIL]: {
    type: 'warning',
    message: '이메일을 입력해주세요',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_PASSWORD]: {
    type: 'warning',
    message: '비밀번호를 입력해주세요',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_CONFIRM_PASSWORD]: {
    type: 'warning',
    message: '비밀번호 확인을 입력해주세요',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_SEARCHKEYWORD]: {
    type: 'warning',
    message: '검색어를 입력해주세요',
  },
  [RESULT_CODE.VALIDATION_INVALID_IMAGE_FILE]: {
    type: 'warning',
    message: 'JPG, JPEG, PNG, GIF, WEBP 형식만 업로드 가능합니다.',
  },

  [RESULT_CODE.VALIDATION_IMAGE_FILE_TOO_LARGE]: {
    type: 'warning',
    message: '파일 용량은 5MB 이하만 업로드 가능합니다.',
  },
  [RESULT_CODE.VALIDATION_PASSWORD_MISMATCH]: {
    type: 'error',
    message: '비밀번호가 일치하지 않습니다.',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_NICKNAME]: {
    type: 'error',
    message: '닉네임을 입력해주세요',
  },
  [RESULT_CODE.VALIDATION_REQUIRED_PREV_PASSWORD]: {
    type: 'error',
    message: '현재 비밀번호를 입력해주세요.',
  },
  //==========댓글==========
  [RESULT_CODE.COMMENT_MAX_LENGTH_EXCEEDED]: {
    type: 'error',
    message: (variables) => `최대 ${variables?.maxLength}자까지 입력 가능합니다.`,
  },

  [RESULT_CODE.COMMENT_MAX_LINE_EXCEEDED]: {
    type: 'error',
    message: (variables) => `최대 ${variables?.maxLines}줄까지 입력 가능합니다.`,
  },

  [RESULT_CODE.COMMENT_PASTE_LIMIT_EXCEEDED]: {
    type: 'error',
    message: '입력 제한을 초과하여 붙여넣을 수 없습니다.',
  },

  [RESULT_CODE.COMMENT_REQUIRED_CONTENT]: {
    type: 'warning',
    message: '내용을 입력해주세요.',
  },

  [RESULT_CODE.COMMENT_CREATE_FAILED]: {
    type: 'error',
    message: '댓글 등록에 실패했습니다.',
  },

  [RESULT_CODE.AUTH_REQUIRED_LOGIN]: {
    type: 'info',
    message: '로그인 후 이용 가능합니다.',
  },
  //==========북마크 태그==========
  [RESULT_CODE.TAG_INVALID_CHARACTER]: {
    type: 'warning',
    message: '태그에는 문자, 숫자, 공백, 하이픈만 사용할 수 있습니다.',
  },

  [RESULT_CODE.TAG_MAX_COUNT_EXCEEDED]: {
    type: 'warning',
    message: (variables) => `태그는 최대 ${variables?.maxTags}개까지 추가할 수 있습니다.`,
  },

  [RESULT_CODE.TAG_ALREADY_EXISTS]: {
    type: 'info',
    message: '이미 추가된 태그입니다.',
  },
  [RESULT_CODE.VALIDATION_TAG_MAX_LENGTH_EXCEEDED]: {
    type: 'warning',
    message: (variables) => `태그는 최대 ${variables?.maxLen}자까지 입력할 수 있어요.`,
  },
  //==========북마크==========
  [RESULT_CODE.BOOKMARK_MEMO_SAVE_FAILED]: {
    type: 'error',
    message: '메모 저장에 실패했습니다.',
  },

  [RESULT_CODE.BOOKMARK_MEMO_DELETE_FAILED]: {
    type: 'error',
    message: '메모 삭제에 실패했습니다.',
  },

  //==========약관동의 오류==========
  [RESULT_CODE.TERMS_REQUIRED_AGREEMENT]: {
    type: 'error',
    message: '필수 약관에 모두 동의해주세요.',
  },

  //==========페이지 네이션==========
  [RESULT_CODE.PAGINATION_PAGE_OUT_OF_RANGE]: {
    type: 'warning',
    message: (variables) => `1 ~ ${variables?.totalPages} 사이의 페이지를 입력해주세요.`,
  },

  //==========검색 안내==========

  //==========server error==========
  [RESULT_CODE.COMMON_SERVER_ERROR]: {
    type: 'error',
    message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  [RESULT_CODE.COMMON_UNKNOWN_ERROR]: {
    type: 'error',
    message: '요청 중 오류가 발생했습니다.',
  },

  [RESULT_CODE.COMMON_FILE_UPLOAD_CANCELLED]: {
    type: 'info',
    message: '이미지 업로드가 취소되었습니다.',
  },
};
