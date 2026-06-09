import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCreateModulo, useUpdateModulo } from '../../hooks/useContent';
import type { Modulo } from '../../types';

interface ModuloFormDialogProps {
  open: boolean;
  trilhaId: string;
  modulo?: Modulo | null;
  onClose: () => void;
}

const ModuloFormDialog: React.FC<ModuloFormDialogProps> = ({ open, trilhaId, modulo, onClose }) => {
  const isEdit = Boolean(modulo);
  const createModulo = useCreateModulo();
  const updateModulo = useUpdateModulo(trilhaId);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [duracao, setDuracao] = useState('');
  const [ordem, setOrdem] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitulo(modulo?.titulo ?? '');
      setDescricao(modulo?.descricao ?? '');
      setConteudo(modulo?.conteudo ?? '');
      setDuracao(modulo?.duracao != null ? String(modulo.duracao) : '');
      setOrdem(modulo?.ordem != null ? String(modulo.ordem) : '');
      setError(null);
    }
  }, [open, modulo]);

  const loading = createModulo.isPending || updateModulo.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const base = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      conteudo: conteudo.trim() || null,
      duracao: duracao ? Number(duracao) : null,
      ordem: ordem ? Number(ordem) : null,
    };
    try {
      if (isEdit && modulo) {
        await updateModulo.mutateAsync({ id: modulo.id_modulo, data: base });
      } else {
        await createModulo.mutateAsync({ id_trilha: trilhaId, ...base });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar o módulo.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isEdit ? 'Editar Módulo' : 'Novo Módulo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required fullWidth autoFocus />
            <TextField label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} fullWidth multiline minRows={2} />
            <TextField
              label="Conteúdo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              fullWidth
              multiline
              minRows={6}
              helperText="Texto corrido. Quebras de linha são preservadas na exibição do curso."
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Duração (min)"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value.replace(/[^0-9]/g, ''))}
                fullWidth
              />
              <TextField
                label="Ordem"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value.replace(/[^0-9]/g, ''))}
                fullWidth
                helperText="Deixe vazio para adicionar ao fim"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !titulo.trim()}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : isEdit ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModuloFormDialog;
