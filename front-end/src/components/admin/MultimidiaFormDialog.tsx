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
import { useCreateMultimidia } from '../../hooks/useContent';

interface MultimidiaFormDialogProps {
  open: boolean;
  trilhaId: string;
  moduloId: string;
  onClose: () => void;
}

const TIPOS = ['video', 'pdf', 'imagem', 'audio', 'link'];

const MultimidiaFormDialog: React.FC<MultimidiaFormDialogProps> = ({ open, trilhaId, moduloId, onClose }) => {
  const createMultimidia = useCreateMultimidia(trilhaId);

  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [tipo, setTipo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitulo('');
      setUrl('');
      setTipo('');
      setError(null);
    }
  }, [open]);

  const loading = createMultimidia.isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await createMultimidia.mutateAsync({
        moduloId,
        data: { titulo: titulo.trim(), url: url.trim() || null, tipo: tipo || null },
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível adicionar o recurso.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>Novo Recurso de Multimídia</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required fullWidth autoFocus />
            <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth placeholder="https://..." />
            <TextField select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} fullWidth>
              <MenuItem value=""><em>Não especificado</em></MenuItem>
              {TIPOS.map((t) => (
                <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
              ))}
            </TextField>
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
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MultimidiaFormDialog;
