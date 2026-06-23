import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '../api/content';
import type {
  ModuloCreate,
  ModuloUpdate,
  MultimidiaCreate,
  TrilhaCreate,
  TrilhaUpdate,
  Setor,
} from '../types';

const trilhasKey = ['content', 'trilhas'] as const;
const trilhaKey = (id: string) => ['content', 'trilha', id] as const;
const setoresKey = ['content', 'setores'] as const;

// Interface para o retorno da mutação de conclusão
export interface ConcluirModuloResponse {
  status: string;
  id_trilha: string;
  modulos_totais: number;
  modulos_concluidos: number;
  trilha_concluida: boolean;
}

// ─── Queries ───────────────────────────────────────────────────────────────────

export const useTrilhas = () =>
  useQuery({
    queryKey: trilhasKey,
    queryFn: contentApi.listTrilhas,
    staleTime: 1000 * 60 * 5,
  });

export const useTrilha = (id: string | undefined) =>
  useQuery({
    queryKey: trilhaKey(id ?? ''),
    queryFn: () => contentApi.getTrilha(id as string),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });

export const useSetores = () =>
  useQuery<Setor[]>({
    queryKey: setoresKey,
    queryFn: contentApi.listSetores,
    staleTime: 1000 * 60 * 60, // Setores raramente mudam, cache de 1 hora
  });

// ─── Trilha mutations (admin) ───────────────────────────────────────────────────

export const useCreateTrilha = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TrilhaCreate) => contentApi.createTrilha(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: trilhasKey }),
  });
};

export const useUpdateTrilha = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TrilhaUpdate }) =>
      contentApi.updateTrilha(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: trilhasKey });
      qc.invalidateQueries({ queryKey: trilhaKey(id) });
    },
  });
};

export const useDeleteTrilha = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteTrilha(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: trilhasKey }),
  });
};

// ─── Módulo mutations (admin) ───────────────────────────────────────────────────

export const useCreateModulo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModuloCreate) => contentApi.createModulo(data),
    onSuccess: (modulo) => {
      qc.invalidateQueries({ queryKey: trilhasKey });
      if (modulo.id_trilha) {
        qc.invalidateQueries({ queryKey: trilhaKey(modulo.id_trilha) });
      }
    },
  });
};

export const useUpdateModulo = (trilhaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModuloUpdate }) =>
      contentApi.updateModulo(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: trilhaKey(trilhaId) }),
  });
};

export const useDeleteModulo = (trilhaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteModulo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trilhasKey });
      qc.invalidateQueries({ queryKey: trilhaKey(trilhaId) });
    },
  });
};

// ─── Multimídia mutations (admin) ───────────────────────────────────────────────

export const useCreateMultimidia = (trilhaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduloId, data }: { moduloId: string; data: MultimidiaCreate }) =>
      contentApi.createMultimidia(moduloId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: trilhaKey(trilhaId) }),
  });
};

export const useDeleteMultimidia = (trilhaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteMultimidia(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: trilhaKey(trilhaId) }),
  });
};

// ─── Progresso mutations (usuário) ──────────────────────────────────────────────

export const useConcluirModulo = () => {
  const qc = useQueryClient();

  return useMutation<ConcluirModuloResponse, Error, string>({
    mutationFn: async (idModulo: string) => {
      // Supondo que contentApi.concluirModulo devolva diretamente a resposta (data)
      return contentApi.concluirModulo(idModulo);
    },
    onSuccess: (data) => {
      // Invalida os caches para forçar a UI a buscar os dados atualizados
      qc.invalidateQueries({ queryKey: trilhasKey });
      if (data.id_trilha) {
        qc.invalidateQueries({ queryKey: trilhaKey(data.id_trilha) });
      }
    },
    onError: (error) => {
      console.error('Erro ao salvar progresso do módulo:', error);
    },
  });
};