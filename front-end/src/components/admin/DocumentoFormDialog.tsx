import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDocumentos, useUploadDocumento } from '../../hooks/useDocumentos';

interface DocumentoFormDialogProps {
  open: boolean;
  onClose: () => void;
}

const DocumentoFormDialog: React.FC<DocumentoFormDialogProps> = ({ open, onClose }) => {
  const { data: categorias } = useDocumentos();
  const uploadMutation = useUploadDocumento();

  const [file, setFile] = useState<File | null>(null);
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file || !nome) {
      setError('Arquivo e nome são obrigatórios.');
      return;
    }
    if (!categoriaId && !novaCategoria) {
      setError('Selecione uma categoria existente ou crie uma nova.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nome', nome);
    if (categoriaId) formData.append('id_categoria', categoriaId);
    if (novaCategoria) formData.append('nova_categoria', novaCategoria);

    try {
      await uploadMutation.mutateAsync(formData);
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload do documento.');
    }
  };

  const handleClose = () => {
    setFile(null);
    setNome('');
    setCategoriaId(null);
    setNovaCategoria('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={uploadMutation.isPending ? undefined : handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>Novo Documento</DialogTitle>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Button variant="outlined" component="label" sx={{ textTransform: 'none', height: 56, borderColor: 'divider' }}>
              {file ? file.name : 'Selecionar Arquivo (PDF, DOC)'}
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </Button>
            
            <TextField
              label="Nome do Documento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              required
            />
            
            <Autocomplete
              options={categorias || []}
              getOptionLabel={(opt) => opt.titulo}
              onChange={(_, val) => {
                setCategoriaId(val?.id_categoria || null);
                if (val) setNovaCategoria('');
              }}
              renderInput={(params) => <TextField {...params} label="Categoria Existente" />}
              disabled={!!novaCategoria}
            />
            
            <TextField
              label="Ou crie uma Nova Categoria"
              value={novaCategoria}
              onChange={(e) => {
                setNovaCategoria(e.target.value);
                if (e.target.value) setCategoriaId(null);
              }}
              fullWidth
              disabled={!!categoriaId}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={uploadMutation.isPending} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={uploadMutation.isPending} sx={{ textTransform: 'none', fontWeight: 700 }}>
            {uploadMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Documento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentoFormDialog;