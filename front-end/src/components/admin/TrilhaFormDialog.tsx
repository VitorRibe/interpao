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
  MenuItem,
  TextField,
} from '@mui/material';
import { useCreateTrilha, useUpdateTrilha } from '../../hooks/useContent';
import type { Setor, TrilhaSummary } from '../../types';

interface TrilhaFormDialogProps {
  open: boolean;
  trilha?: TrilhaSummary | null;
  setores: Setor[];
  onClose: () => void;
}

const TrilhaFormDialog: React.FC<TrilhaFormDialogProps> = ({ open, trilha, setores, onClose }) => {
  const isEdit = Boolean(trilha);
  const createTrilha = useCreateTrilha();
  const updateTrilha = useUpdateTrilha();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargaHor, setCargaHor] = useState('');
  const [idSetor, setIdSetor] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitulo(trilha?.titulo ?? '');
      setDescricao(trilha?.descricao ?? '');
      setCargaHor(trilha?.carga_hor != null ? String(trilha.carga_hor) : '');
      setIdSetor(trilha?.id_setor ?? '');
      setError(null);
    }
  }, [open, trilha]);

  const loading = createTrilha.isPending || updateTrilha.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      carga_hor: cargaHor ? Number(cargaHor) : null,
      id_setor: idSetor || null,
    };
    try {
      if (isEdit && trilha) {
        await updateTrilha.mutateAsync({ id: trilha.id_trilha, data: payload });
      } else {
        await createTrilha.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar a trilha.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isEdit ? 'Editar Trilha' : 'Nova Trilha'}
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Carga horária (h)"
                value={cargaHor}
                onChange={(e) => setCargaHor(e.target.value.replace(/[^0-9]/g, ''))}
                fullWidth
              />
              <TextField
                select
                label="Setor"
                value={idSetor}
                onChange={(e) => setIdSetor(e.target.value)}
                fullWidth
                helperText={setores.length ? undefined : 'Nenhum setor cadastrado'}
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {setores.map((s) => (
                  <MenuItem key={s.id_setor} value={s.id_setor}>
                    {s.nome}
                  </MenuItem>
                ))}
              </TextField>
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

export default TrilhaFormDialog;
