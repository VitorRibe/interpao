import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '../api/recipes';
import type {
  IngredienteCreate,
  IngredienteUpdate,
  ItemReceitaCreate,
  ReceitaCreate,
  ReceitaUpdate,
} from '../types';

const receitasKey = ['recipes', 'receitas'] as const;
const receitaKey = (id: string) => ['recipes', 'receita', id] as const;
const ingredientesKey = ['recipes', 'ingredientes'] as const;
const setoresKey = ['recipes', 'setores'] as const;

// ─── Queries ───────────────────────────────────────────────────────────────────

export const useReceitaSetores = () =>
  useQuery({
    queryKey: setoresKey,
    queryFn: recipesApi.listSetores,
    staleTime: 1000 * 60 * 10,
  });

export const useIngredientes = () =>
  useQuery({
    queryKey: ingredientesKey,
    queryFn: recipesApi.listIngredientes,
    staleTime: 1000 * 60 * 5,
  });

export const useReceitas = () =>
  useQuery({
    queryKey: receitasKey,
    queryFn: recipesApi.listReceitas,
    staleTime: 1000 * 60 * 5,
  });

export const useReceita = (id: string | undefined) =>
  useQuery({
    queryKey: receitaKey(id ?? ''),
    queryFn: () => recipesApi.getReceita(id as string),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });

// ─── Receita mutations ─────────────────────────────────────────────────────────

export const useCreateReceita = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReceitaCreate) => recipesApi.createReceita(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: receitasKey }),
  });
};

export const useUpdateReceita = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReceitaUpdate }) =>
      recipesApi.updateReceita(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: receitasKey });
      qc.invalidateQueries({ queryKey: receitaKey(id) });
    },
  });
};

export const useDeleteReceita = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipesApi.deleteReceita(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: receitasKey }),
  });
};

// ─── Ingrediente mutations ──────────────────────────────────────────────────────

export const useCreateIngrediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IngredienteCreate) => recipesApi.createIngrediente(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ingredientesKey }),
  });
};

export const useUpdateIngrediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IngredienteUpdate }) =>
      recipesApi.updateIngrediente(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ingredientesKey }),
  });
};

export const useDeleteIngrediente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recipesApi.deleteIngrediente(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ingredientesKey }),
  });
};

// ─── Item receita mutations ─────────────────────────────────────────────────────

export const useAddItemReceita = (receitaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemReceitaCreate) => recipesApi.addItem(receitaId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: receitasKey });
      qc.invalidateQueries({ queryKey: receitaKey(receitaId) });
    },
  });
};

export const useUpdateItemReceita = (receitaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ingrId, qtd }: { ingrId: string; qtd: number }) =>
      recipesApi.updateItem(receitaId, ingrId, qtd),
    onSuccess: () => qc.invalidateQueries({ queryKey: receitaKey(receitaId) }),
  });
};

export const useRemoveItemReceita = (receitaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ingrId: string) => recipesApi.removeItem(receitaId, ingrId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: receitasKey });
      qc.invalidateQueries({ queryKey: receitaKey(receitaId) });
    },
  });
};

// ─── Setor receita mutations ────────────────────────────────────────────────────

export const useAddSetorReceita = (receitaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (setorId: string) => recipesApi.addSetor(receitaId, setorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: receitasKey });
      qc.invalidateQueries({ queryKey: receitaKey(receitaId) });
    },
  });
};

export const useRemoveSetorReceita = (receitaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (setorId: string) => recipesApi.removeSetor(receitaId, setorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: receitasKey });
      qc.invalidateQueries({ queryKey: receitaKey(receitaId) });
    },
  });
};
