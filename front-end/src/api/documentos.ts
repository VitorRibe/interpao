import apiClient from './client';
import type { CategoriaDocumento, Documento } from '../types';

export const documentosApi = {
  getCategorias: async (): Promise<CategoriaDocumento[]> => {
    const res = await apiClient.get<CategoriaDocumento[]>('/documentos');
    return res.data;
  },

  uploadDocumento: async (file: File, nome: string, id_categoria?: string, nova_categoria?: string): Promise<Documento> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nome', nome);
    
    if (nova_categoria) {
      formData.append('nova_categoria', nova_categoria);
    } else if (id_categoria) {
      formData.append('id_categoria', id_categoria);
    }
    
    const res = await apiClient.post<Documento>('/documentos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteDocumento: async (id_documento: string): Promise<void> => {
    await apiClient.delete(`/documentos/${id_documento}`);
  }
};