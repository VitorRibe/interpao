import apiClient from './client';
import type {
  Modulo,
  ModuloCreate,
  ModuloUpdate,
  Multimidia,
  MultimidiaCreate,
  Trilha,
  TrilhaCreate,
  TrilhaSummary,
  TrilhaUpdate,
  Setor,
} from '../types';

export interface ConcluirModuloResponse {
  status: string;
  id_trilha: string;
  modulos_totais: number;
  modulos_concluidos: number;
  trilha_concluida: boolean;
}

export interface UserProgresso {
  modulos: string[];
  trilhas: string[];
}

export const contentApi = {
  // ── Progresso Global ──
  getProgresso: async (): Promise<UserProgresso> => {
    const response = await apiClient.get<UserProgresso>('/content/progresso');
    return response.data;
  },

  // ── Setores ──
  listSetores: async (): Promise<Setor[]> => {
    const response = await apiClient.get<Setor[]>('/content/setores');
    return response.data;
  },

  // ── Trilhas ──
  listTrilhas: async (): Promise<TrilhaSummary[]> => {
    const response = await apiClient.get<TrilhaSummary[]>('/content/trilhas');
    return response.data;
  },
  getTrilha: async (id: string): Promise<Trilha> => {
    const response = await apiClient.get<Trilha>(`/content/trilhas/${id}`);
    return response.data;
  },
  createTrilha: async (data: TrilhaCreate): Promise<Trilha> => {
    const response = await apiClient.post<Trilha>('/content/trilhas', data);
    return response.data;
  },
  updateTrilha: async (id: string, data: TrilhaUpdate): Promise<Trilha> => {
    const response = await apiClient.put<Trilha>(`/content/trilhas/${id}`, data);
    return response.data;
  },
  deleteTrilha: async (id: string): Promise<void> => {
    await apiClient.delete(`/content/trilhas/${id}`);
  },

  // ── Módulos ──
  listModulos: async (trilhaId: string): Promise<Modulo[]> => {
    const response = await apiClient.get<Modulo[]>(
      `/content/trilhas/${trilhaId}/modulos`,
    );
    return response.data;
  },
  createModulo: async (data: ModuloCreate): Promise<Modulo> => {
    const response = await apiClient.post<Modulo>('/content/modulos', data);
    return response.data;
  },
  updateModulo: async (id: string, data: ModuloUpdate): Promise<Modulo> => {
    const response = await apiClient.put<Modulo>(`/content/modulos/${id}`, data);
    return response.data;
  },
  deleteModulo: async (id: string): Promise<void> => {
    await apiClient.delete(`/content/modulos/${id}`);
  },

  // ── Progresso do Usuário ──
  concluirModulo: async (idModulo: string): Promise<ConcluirModuloResponse> => {
    const response = await apiClient.post<ConcluirModuloResponse>(
      `/content/modulos/${idModulo}/concluir`
    );
    return response.data;
  },

  // ── Multimídia ──
  createMultimidia: async (
    moduloId: string,
    data: MultimidiaCreate,
  ): Promise<Multimidia> => {
    const response = await apiClient.post<Multimidia>(
      `/content/modulos/${moduloId}/multimidia`,
      data,
    );
    return response.data;
  },
  deleteMultimidia: async (id: string): Promise<void> => {
    await apiClient.delete(`/content/multimidia/${id}`);
  },
};