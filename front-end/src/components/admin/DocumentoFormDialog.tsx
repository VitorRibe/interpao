import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { documentosApi } from '../../api/documentos';

interface DocumentoFormDialogProps {
  open: boolean;
  onClose: () => void;
  categorias: Array<{ id_categoria: string; titulo: string }>;
}

const DocumentoFormDialog: React.FC<DocumentoFormDialogProps> = ({ open, onClose, categorias }) => {
  const [nome, setNome] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCriandoNovaCategoria = categoriaSelecionada === 'NEW_CATEGORY';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    setError('');

    try {
      if (isCriandoNovaCategoria) {
        await documentosApi.uploadDocumento(file!, nome, undefined, novaCategoria);
      } else {
        await documentosApi.uploadDocumento(file!, nome, categoriaSelecionada, undefined);
      }
      handleClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao enviar documento. Verifique a conexão com o servidor.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setNome('');
    setCategoriaSelecionada('');
    setNovaCategoria('');
    setFile(null);
    setError('');
    setIsUploading(false);
    onClose();
  };

  const isFormValid = 
    nome.trim() !== '' && 
    file !== null && 
    (isCriandoNovaCategoria ? novaCategoria.trim() !== '' : categoriaSelecionada !== '');

  return (
    <Dialog open={open} onClose={isUploading ? undefined : handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>Novo Documento</DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}

          {/* Seletor de Categoria */}
          <TextField
            select
            fullWidth
            size="small"
            variant="outlined"
            label="Categoria"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            disabled={isUploading}
          >
            <MenuItem value="NEW_CATEGORY" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8 }}>add</span>
              + Nova Categoria...
            </MenuItem>
            
            <Divider sx={{ my: 0.5 }} />

            {categorias.map((cat) => (
              <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                {cat.titulo}
              </MenuItem>
            ))}
          </TextField>

          {/* Campo de texto condicional para Nova Categoria */}
          {isCriandoNovaCategoria && (
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Nome da Nova Categoria"
              placeholder="Ex: Manuais Técnicos"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              autoFocus
              disabled={isUploading}
            />
          )}

          {/* Nome do Documento */}
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Nome do Documento"
            placeholder="Ex: Código de Ética 2026"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isUploading}
          />

          {/* Input de Arquivo */}
          <Box>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{ textTransform: 'none', fontWeight: 700, borderStyle: 'dashed' }}
            >
              {file ? 'Alterar Arquivo' : 'Selecionar PDF/Word'}
            </Button>
            {file && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                Arquivo selecionado: <strong>{file.name}</strong>
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isUploading} sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid || isUploading}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          {isUploading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentoFormDialog;