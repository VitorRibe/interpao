import apiClient from './client';

export interface Benefit {
  id_beneficio: string;
  titulo: string;
  descricao: string | null;
  como_usar: string | null;
  categoria: string;
  icone: string;
  tipo?: string | null;
  detalhes_padrao: string | null;
  valor_customizado: string | null;
  is_active: boolean;
}

export interface BenefitCreate {
  titulo: string;
  descricao?: string | null;
  como_usar?: string | null;
  categoria: string;
  icone: string;
  tipo?: string | null;
  detalhes_padrao?: string | null;
}

export type BenefitUpdate = Partial<BenefitCreate>;

export const benefitsApi = {
  listMyBenefits: async (): Promise<Benefit[]> => {
    const res = await apiClient.get<Benefit[]>('/beneficios');
    return res.data;
  },

  listUserBenefits: async (userId: string): Promise<Benefit[]> => {
    const res = await apiClient.get<Benefit[]>(`/beneficios/user/${userId}`);
    return res.data;
  },

  createBenefit: async (data: BenefitCreate): Promise<Benefit> => {
    const res = await apiClient.post<Benefit>('/beneficios', data);
    return res.data;
  },

  updateBenefit: async (id: string, data: BenefitUpdate): Promise<Benefit> => {
    const res = await apiClient.put<Benefit>(`/beneficios/${id}`, data);
    return res.data;
  },

  deleteBenefit: async (id: string): Promise<void> => {
    await apiClient.delete(`/beneficios/${id}`);
  },

  assignBenefit: async (userId: string, benefitId: string, customValue?: string | null): Promise<void> => {
    await apiClient.post(`/beneficios/user/${userId}/assign/${benefitId}`, {
      valor_customizado: customValue || null,
    });
  },

  unassignBenefit: async (userId: string, benefitId: string): Promise<void> => {
    await apiClient.delete(`/beneficios/user/${userId}/unassign/${benefitId}`);
  },
};
