import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { escalaApi } from '../api/escala';
import type { UpsertEscalaRequest } from '../types';

export const myEscalaKey = ['escala', 'me'] as const;
const userEscalaKey = (userId: string) => ['escala', 'user', userId] as const;

export const useMyEscala = () =>
  useQuery({
    queryKey: myEscalaKey,
    queryFn: escalaApi.getMyEscala,
    staleTime: 1000 * 60 * 5,
  });

export const useUserEscala = (userId: string | null) =>
  useQuery({
    queryKey: userEscalaKey(userId ?? ''),
    queryFn: () => escalaApi.getUserEscala(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });

export const useUpsertEscala = (userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertEscalaRequest) => escalaApi.upsertUserEscala(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userEscalaKey(userId) });
      qc.invalidateQueries({ queryKey: myEscalaKey });
    },
  });
};
