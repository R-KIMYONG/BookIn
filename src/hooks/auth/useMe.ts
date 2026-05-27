import { MINUTE } from '@/shared/constants/time';
import { userKeys } from '@/shared/domain/user/queryKeys';
import { MypageUserInfo } from '@/shared/domain/user/types';
import { useQuery } from '@tanstack/react-query';

const useMe = () => {
  return useQuery<MypageUserInfo | null, Error>({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await fetch('/api/user/me', { method: 'GET' });

      if (!response.ok) {
        throw new Error('유저 정보 조회 실패');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * MINUTE,
  });
};

export default useMe;