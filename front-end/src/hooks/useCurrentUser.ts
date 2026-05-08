import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
