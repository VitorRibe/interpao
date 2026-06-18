import apiClient from './client';
import type {
  AdminCreateUserRequest,
  AdminListUsersResponse,
  AdminUpdateUserRequest,
  AdminUser,
  Setor,
} from '../types';

export interface ProgressoFuncionario {
  user_id: string;
  nome: string;
  setor: string;
  cargo: string | null;
  trilhas_concluidas: number;
  total_trilhas: number;
  progresso_pct: number;
}

export const adminApi = {
  listUsers: async (skip = 0, limit = 10): Promise<AdminListUsersResponse> => {
    const res = await apiClient.get<AdminListUsersResponse>('/admin/users', {
      params: { skip, limit },
    });
    return res.data;
  },

  createUser: async (data: AdminCreateUserRequest): Promise<AdminUser> => {
    const res = await apiClient.post<AdminUser>('/admin/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: AdminUpdateUserRequest): Promise<AdminUser> => {
    const res = await apiClient.put<AdminUser>(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  resetPassword: async (id: string): Promise<{ message: string; temp_password: string }> => {
    const res = await apiClient.post<{ message: string; temp_password: string }>(
      `/admin/users/${id}/reset-password`,
    );
    return res.data;
  },

  listSetores: async (): Promise<Setor[]> => {
    const res = await apiClient.get<{ setores: Array<Setor & { descricao: string | null }> }>(
      '/admin/setores',
    );
    return res.data.setores;
  },

  getProgressoEquipe: async (): Promise<ProgressoFuncionario[]> => {
    const res = await apiClient.get<ProgressoFuncionario[]>('/admin/progresso');
    return res.data;
  },
};