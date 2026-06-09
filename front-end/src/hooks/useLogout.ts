import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

/**
 * Full logout: ends the server session (best-effort), drops the access token
 * and wipes the React Query cache so no stale user (e.g. an outdated is_admin)
 * survives into the next login.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort: even if the server call fails, clear the client state.
    }
    localStorage.removeItem('token');
    queryClient.clear();
    navigate('/login', { replace: true });
  };
};
