import apiClient from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Company {
  id: string;
  name: string;
  image_url: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  image_url: string | null;
  is_admin: boolean;
  is_superuser: boolean;
  company: Company;
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
};

