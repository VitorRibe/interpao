import api from './client';

export interface Documento {
  id_documento: string;
  nome: string;
  descricao?: string;
  tipo_arquivo: string;
  url: string;
  data_atualizacao: string;
}

export interface CategoriaDocumento {
  id_categoria: string;
  titulo: string;
  descricao?: string;
  documentos: Documento[];
}

// Captura a URL base do ambiente (ex: http://137.184.49.71:8000/api/v1)
// e usa Regex para remover o "/api/v1" ou "/api", apontando direto para a raiz do Back-end.
const getRootUrl = () => {
  const currentBaseUrl = import.meta.env.VITE_API_URL || api.defaults.baseURL || 'http://localhost:3000/api';
  return currentBaseUrl.replace(/\/api(\/v1)?$/, '');
};

export const getDocumentos = async (): Promise<CategoriaDocumento[]> => {
  const { data } = await api.get('/documentos', { baseURL: getRootUrl() });
  return data;
};

export const uploadDocumento = async (formData: FormData): Promise<Documento> => {
  const { data } = await api.post('/documentos/upload', formData, {
    baseURL: getRootUrl(),
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteDocumento = async (id: string): Promise<void> => {
  await api.delete(`/documentos/${id}`, { baseURL: getRootUrl() });
};