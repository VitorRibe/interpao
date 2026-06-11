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
import { useCreateIngrediente, useUpdateIngrediente } from '../../hooks/useRecipes';
import type { Ingrediente } from '../../types';

interface IngredienteFormDialogProps {
  open: boolean;
  ingrediente?: Ingrediente | null;
  onClose: () => void;
}

const IngredienteFormDialog: React.FC<IngredienteFormDialogProps> = ({ open, ingrediente, onClose }) => {
  const isEdit = Boolean(ingrediente);
  const createIngrediente = useCreateIngrediente();
  const updateIngrediente = useUpdateIngrediente();

  const [nome, setNome] = useState('');
  const [unidadeMed, setUnidadeMed] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNome(ingrediente?.nome ?? '');
      setUnidadeMed(ingrediente?.unidade_med ?? '');
      setError(null);
    }
  }, [open, ingrediente]);

  const loading = createIngrediente.isPending || updateIngrediente.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const payload = {
      nome: nome.trim(),
      unidade_med: unidadeMed.trim(),
    };
    try {
      if (isEdit && ingrediente) {
        await updateIngrediente.mutateAsync({ id: ingrediente.id_ingr, data: payload });
      } else {
        await createIngrediente.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar o ingrediente.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isEdit ? 'Editar Ingrediente' : 'Novo Ingrediente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            <TextField
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Unidade de Medida"
              value={unidadeMed}
              onChange={(e) => setUnidadeMed(e.target.value)}
              required
              fullWidth
              placeholder="ex: kg, g, ml, L, un"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !nome.trim() || !unidadeMed.trim()}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : isEdit ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IngredienteFormDialog;
