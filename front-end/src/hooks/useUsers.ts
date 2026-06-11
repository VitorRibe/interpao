import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin';
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from '../types';

const usersKey = (skip: number, limit: number) => ['admin', 'users', skip, limit] as const;
const setoresAdminKey = ['admin', 'setores'] as const;

export const useUsers = (skip: number, limit: number) =>
  useQuery({
    queryKey: usersKey(skip, limit),
    queryFn: () => adminApi.listUsers(skip, limit),
  });

export const useAdminSetores = () =>
  useQuery({
    queryKey: setoresAdminKey,
    queryFn: adminApi.listSetores,
    staleTime: 1000 * 60 * 10,
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCreateUserRequest) => adminApi.createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserRequest }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useDeactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
};

export const useResetPassword = () =>
  useMutation({
    mutationFn: (id: string) => adminApi.resetPassword(id),
  });
