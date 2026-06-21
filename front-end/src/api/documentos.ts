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

export const getDocumentos = async (): Promise<CategoriaDocumento[]> => {
  const { data } = await api.get('/documentos');
  return data;
};

export const uploadDocumento = async (formData: FormData): Promise<Documento> => {
  const { data } = await api.post('/documentos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteDocumento = async (id: string): Promise<void> => {
  await api.delete(`/documentos/${id}`);
};