import apiClient from './client';
import type { EscalaResponse, UpsertEscalaRequest } from '../types';

export const escalaApi = {
  getMyEscala: async (): Promise<EscalaResponse> => {
    const res = await apiClient.get<EscalaResponse>('/escala/me');
    return res.data;
  },

  getUserEscala: async (userId: string): Promise<EscalaResponse> => {
    const res = await apiClient.get<EscalaResponse>(`/escala/admin/${userId}`);
    return res.data;
  },

  upsertUserEscala: async (userId: string, data: UpsertEscalaRequest): Promise<EscalaResponse> => {
    const res = await apiClient.put<EscalaResponse>(`/escala/admin/${userId}`, data);
    return res.data;
  },
};
