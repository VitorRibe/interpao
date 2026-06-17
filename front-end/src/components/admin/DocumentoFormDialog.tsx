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
} from '@mui/material';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCriandoNovaCategoria = categoriaSelecionada === 'NEW_CATEGORY';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const categoriaFinal = isCriandoNovaCategoria ? novaCategoria : categoriaSelecionada;
    
    // Aqui simula o envio dos dados
    console.log('Enviando dados do Documento:', {
      nome,
      categoria: categoriaFinal,
      isNovaCategoria: isCriandoNovaCategoria,
      file,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setNome('');
    setCategoriaSelecionada('');
    setNovaCategoria('');
    setFile(null);
    onClose();
  };

  // Verifica se o formulário está válido para liberar o botão Salvar
  const isFormValid = 
    nome.trim() !== '' && 
    file !== null && 
    (isCriandoNovaCategoria ? novaCategoria.trim() !== '' : categoriaSelecionada !== '');

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>Novo Documento</DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          
          {/* Seletor de Categoria */}
          <TextField
            select
            fullWidth
            size="small"
            variant="outlined"
            label="Categoria"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          >
            {/* Opção especial para criar uma nova */}
            <MenuItem value="NEW_CATEGORY" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 8 }}>add</span>
              + Nova Categoria...
            </MenuItem>
            
            <Divider sx={{ my: 0.5 }} />

            {/* Listagem das categorias existentes */}
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
        <Button onClick={handleClose} sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentoFormDialog;