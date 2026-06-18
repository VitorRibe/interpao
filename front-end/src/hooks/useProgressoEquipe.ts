import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/admin';

export const useProgressoEquipe = () => {
  return useQuery({
    queryKey: ['admin', 'progresso'],
    queryFn: adminApi.getProgressoEquipe,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
};