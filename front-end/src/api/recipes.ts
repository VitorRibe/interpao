import apiClient from './client';
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
  ItemReceitaCreate,
  Receita,
  ReceitaCreate,
  ReceitaSummary,
  ReceitaUpdate,
  Setor,
} from '../types';

export const recipesApi = {
  // ── Setores ──
  listSetores: async (): Promise<Setor[]> => {
    const response = await apiClient.get<Setor[]>('/recipes/setores');
    return response.data;
  },

  // ── Ingredientes ──
  listIngredientes: async (): Promise<Ingrediente[]> => {
    const response = await apiClient.get<Ingrediente[]>('/recipes/ingredientes');
    return response.data;
  },
  createIngrediente: async (data: IngredienteCreate): Promise<Ingrediente> => {
    const response = await apiClient.post<Ingrediente>('/recipes/ingredientes', data);
    return response.data;
  },
  updateIngrediente: async (id: string, data: IngredienteUpdate): Promise<Ingrediente> => {
    const response = await apiClient.put<Ingrediente>(`/recipes/ingredientes/${id}`, data);
    return response.data;
  },
  deleteIngrediente: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipes/ingredientes/${id}`);
  },

  // ── Receitas ──
  listReceitas: async (): Promise<ReceitaSummary[]> => {
    const response = await apiClient.get<ReceitaSummary[]>('/recipes/receitas');
    return response.data;
  },
  getReceita: async (id: string): Promise<Receita> => {
    const response = await apiClient.get<Receita>(`/recipes/receitas/${id}`);
    return response.data;
  },
  createReceita: async (data: ReceitaCreate): Promise<Receita> => {
    const response = await apiClient.post<Receita>('/recipes/receitas', data);
    return response.data;
  },
  updateReceita: async (id: string, data: ReceitaUpdate): Promise<Receita> => {
    const response = await apiClient.put<Receita>(`/recipes/receitas/${id}`, data);
    return response.data;
  },
  deleteReceita: async (id: string): Promise<void> => {
    await apiClient.delete(`/recipes/receitas/${id}`);
  },

  // ── Itens da Receita ──
  addItem: async (receitaId: string, data: ItemReceitaCreate): Promise<Receita> => {
    const response = await apiClient.post<Receita>(
      `/recipes/receitas/${receitaId}/itens`,
      data,
    );
    return response.data;
  },
  updateItem: async (receitaId: string, ingrId: string, qtd: number): Promise<Receita> => {
    const response = await apiClient.put<Receita>(
      `/recipes/receitas/${receitaId}/itens/${ingrId}`,
      { qtd },
    );
    return response.data;
  },
  removeItem: async (receitaId: string, ingrId: string): Promise<void> => {
    await apiClient.delete(`/recipes/receitas/${receitaId}/itens/${ingrId}`);
  },

  // ── Setores da Receita ──
  addSetor: async (receitaId: string, setorId: string): Promise<Receita> => {
    const response = await apiClient.post<Receita>(
      `/recipes/receitas/${receitaId}/setores/${setorId}`,
    );
    return response.data;
  },
  removeSetor: async (receitaId: string, setorId: string): Promise<void> => {
    await apiClient.delete(`/recipes/receitas/${receitaId}/setores/${setorId}`);
  },
};
