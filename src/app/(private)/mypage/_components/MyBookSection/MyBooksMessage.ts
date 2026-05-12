import { SearchField } from '@/shared/domain/mybooks/search';
import { MyPageQuery } from '@/shared/domain/mybooks/types';
import { MyBooksTabType } from '@/shared/domain/mypage/tab';

type EmptyContext = {
  tab: MyBooksTabType;
  search?: string;
  searchField?: string;
  filter?: string;
  tagId?: string;
  tagName?: string | null;
};

type ErrorContext = {
  tab: MyBooksTabType;
  error?: Error | null;
  tagId?: string;
  tagName?: string | null;
  search?: string;
  searchField?: string;
  refetch: () => void;
  setQuery: (v: Partial<MyPageQuery>) => void;
};

export const getMyBooksEmptyMessage = ({ tab, search, searchField, filter, tagId, tagName }: EmptyContext) => {
  // 검색 있는 경우
  const fieldMap = {
    title: '제목',
    author: '저자',
    memo: '메모',
    content: '댓글',
  };

  if (search) {
    const field = fieldMap[searchField as keyof typeof fieldMap] ?? '검색어';
    return {
      emptyStateTitle: '검색 결과가 없습니다',
      emptyStateDescription: `${field}: "${search}"에 대한 결과가 없습니다.`,
    };
  }
  // 태그 필터
  if (tagId) {
    if (!tagName) {
      return {
        emptyStateTitle: '잘못된 접근',
        emptyStateDescription: '존재하지 않는 태그입니다.',
      };
    }
    return {
      emptyStateTitle: '태그 결과 없음',
      emptyStateDescription: `"${tagName}" 태그에 해당하는 책이 없습니다.`,
    };
  }
  // 메모 필터
  if (filter === 'memo') {
    return {
      emptyStateTitle: '메모 없음',
      emptyStateDescription: '메모가 있는 책이 없습니다.',
    };
  }
  if (filter === 'no_memo') {
    return {
      emptyStateTitle: '메모 없음',
      emptyStateDescription: '메모가 없는 책이 없습니다.',
    };
  }
  // 기본 상태
  switch (tab) {
    case 'comment':
      return {
        emptyStateTitle: '댓글 없음',
        emptyStateDescription: '아직 댓글을 남긴 책이 없습니다.',
      };
    case 'like':
      return {
        emptyStateTitle: '좋아요 없음',
        emptyStateDescription: '좋아요한 책이 없습니다.',
      };
    case 'bookmark':
      return {
        emptyStateTitle: '북마크 없음',
        emptyStateDescription: '북마크한 책이 없습니다.',
      };
  }
};

export const getMyBooksErrorMessage = ({
  tab,
  error,
  tagId,
  tagName,
  search,
  searchField,
  refetch,
  setQuery,
}: ErrorContext) => {
  // 잘못된 태그 (사전 방어 못한 경우)
  if (tagId && !tagName) {
    return {
      errorTitle: '잘못된 요청',
      errorDescription: '존재하지 않는 태그입니다.',
      action: {
        label: '전체 보기',
        onClick: () => setQuery({ tagId: undefined }),
      },
    };
  }

  // 검색 중 에러
  if (search) {
    const fieldMap: Record<SearchField, string> = {
      title: '제목',
      author: '저자',
      memo: '메모',
      content: '댓글',
    };

    const field = fieldMap[searchField as keyof typeof fieldMap] ?? '검색어';

    return {
      errorTitle: '검색 중 오류 발생',
      errorDescription: `${field} 검색 중 문제가 발생했습니다.`,
      action: {
        label: '다시 시도',
        onClick: () => refetch(),
      },
    };
  }

  // 기본 tab별 메시지
  switch (tab) {
    case 'comment':
      return {
        errorTitle: '댓글 로딩 실패',
        errorDescription: '댓글 정보를 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    case 'like':
      return {
        errorTitle: '좋아요 로딩 실패',
        errorDescription: '좋아요 목록을 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    case 'bookmark':
      return {
        errorTitle: '북마크 로딩 실패',
        errorDescription: '북마크 목록을 불러오는 중 문제가 발생했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
    default:
      return {
        errorTitle: '오류 발생',
        errorDescription: error?.message ?? '데이터를 불러오지 못했습니다.',
        action: {
          label: '재시도',
          onClick: () => refetch(),
        },
      };
  }
};
