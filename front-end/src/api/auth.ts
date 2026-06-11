import apiClient from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoggedUserSetor {
  id_setor: string;
  nome: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  image_url: string | null;
  cargo: string | null;
  is_admin: boolean;
  is_superuser: boolean;
  setor: LoggedUserSetor;
}


export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/current_user');
    return response.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.delete('/auth/logout');
  },
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>('/auth/change-password', data);
    return response.data;
  },
};

