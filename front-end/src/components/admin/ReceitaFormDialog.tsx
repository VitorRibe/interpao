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
import { useCreateReceita, useUpdateReceita } from '../../hooks/useRecipes';
import type { ReceitaSummary } from '../../types';

interface ReceitaFormDialogProps {
  open: boolean;
  receita?: ReceitaSummary | null;
  onClose: () => void;
}

const ReceitaFormDialog: React.FC<ReceitaFormDialogProps> = ({ open, receita, onClose }) => {
  const isEdit = Boolean(receita);
  const createReceita = useCreateReceita();
  const updateReceita = useUpdateReceita();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [instPreparo, setInstPreparo] = useState('');
  const [tempoPreparo, setTempoPreparo] = useState('');
  const [porcoes, setPorcoes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitulo(receita?.titulo ?? '');
      setDescricao(receita?.descricao ?? '');
      setInstPreparo(receita?.inst_preparo ?? '');
      setTempoPreparo(receita?.tempo_preparo != null ? String(receita.tempo_preparo) : '');
      setPorcoes(receita?.porcoes != null ? String(receita.porcoes) : '');
      setError(null);
    }
  }, [open, receita]);

  const loading = createReceita.isPending || updateReceita.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      inst_preparo: instPreparo.trim() || null,
      tempo_preparo: tempoPreparo ? Number(tempoPreparo) : null,
      porcoes: porcoes ? Number(porcoes) : null,
    };
    try {
      if (isEdit && receita) {
        await updateReceita.mutateAsync({ id: receita.id_receita, data: payload });
      } else {
        await createReceita.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar a receita.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isEdit ? 'Editar Receita' : 'Nova Receita'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Instruções de Preparo"
              value={instPreparo}
              onChange={(e) => setInstPreparo(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Tempo de preparo (min)"
                value={tempoPreparo}
                onChange={(e) => setTempoPreparo(e.target.value.replace(/[^0-9]/g, ''))}
                fullWidth
              />
              <TextField
                label="Porções"
                value={porcoes}
                onChange={(e) => setPorcoes(e.target.value.replace(/[^0-9]/g, ''))}
                fullWidth
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

export default ReceitaFormDialog;
