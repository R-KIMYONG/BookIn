'use client';

import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth.actions';
import Button from '@/components/common/ui/Button';
import { showToast } from '@/shared/lib/message/showToast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/context/AuthContext';
import { likeKeys } from '@/shared/domain/like/queryKeys';
import { bookmarkKeys } from '@/shared/domain/bookmark/queryKeys';

const HeaderLogoutForm = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const router = useRouter();
  const handleLogout = async (formData: FormData) => {
    const result = await logout(formData);

    if (result.ok) {
      //개인화된 캐시만 지우고 공개 데이터는 유지
      queryClient.removeQueries({ queryKey: likeKeys.all });
      queryClient.removeQueries({ queryKey: bookmarkKeys.all });
      queryClient.removeQueries({ queryKey: ['myStatus'] });
      router.replace(result.data.redirectTo);
      setUser(null);
    }
    showToast(result.code);
  };

  return (
    <form action={handleLogout}>
      <input type="hidden" name="next" value={pathname} />
      <Button type="submit" variant="navbarDark" label="로그아웃" size="xs" className="w-full" />
    </form>
  );
};

export default HeaderLogoutForm;
