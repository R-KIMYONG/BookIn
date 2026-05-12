import { createClient } from '@/shared/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

const useUser = () => {
  const supabase = createClient();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      return data.user ?? null;
    },
  });
};

export default useUser;
