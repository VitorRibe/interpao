import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocumentos, uploadDocumento, deleteDocumento } from '../api/documentos';

export const useDocumentos = () => {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: getDocumentos,
  });
};

export const useUploadDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });
};

export const useDeleteDocumento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });
};