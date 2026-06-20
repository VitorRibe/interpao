import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import DocumentoFormDialog from '../components/admin/DocumentoFormDialog';
import { documentosApi } from '../api/documentos';
import type { CategoriaDocumento } from '../types';

const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 20, color }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color }}>{name}</span>
);

const DocumentsPage: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const isUserAdmin = currentUser?.setor?.nome?.toLowerCase() === 'administrativo' || currentUser?.is_admin === true;

  const [categorias, setCategorias] = useState<CategoriaDocumento[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados reais da API
  const fetchDocumentos = async () => {
    setIsLoading(true);
    try {
      const data = await documentosApi.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      // Aqui você pode adicionar um toast/snackbar de erro se quiser
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const filteredCategorias = useMemo(() => {
    return categorias.filter(cat => 
      cat.titulo.toLowerCase().includes(search.toLowerCase()) ||
      cat.documentos.some(doc => doc.nome.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, categorias]);

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Documentos Corporativos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Acesse manuais, códigos de conduta e diretrizes importantes da empresa.
          </Typography>
        </Box>
        {isUserAdmin && (
          <Button
            variant="contained"
            startIcon={<Icon name="add" size={18} />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
          >
            Novo Documento
          </Button>
        )}
      </Box>

      {/* Busca */}
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Buscar documento ou categoria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Icon name="search" />
              </InputAdornment>
            ),
          }
        }}
      />

      {/* Listagem de Categorias */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : filteredCategorias.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            Nenhum documento encontrado.
          </Typography>
        ) : (
          filteredCategorias.map((cat) => (
            <Accordion key={cat.id_categoria} disableGutters sx={{ borderRadius: 2, '&:before': { display: 'none' }, border: '1px solid', borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<Icon name="expand_more" />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Icon name="folder" color="#7f5600" />
                  <Typography sx={{ fontWeight: 700 }}>{cat.titulo}</Typography>
                  <Chip label={`${cat.documentos.length} doc(s)`} size="small" variant="outlined" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                  {cat.documentos.map((doc) => (
                    <ListItem 
                      key={doc.id_documento} 
                      divider 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        cursor: 'pointer' 
                      }}
                    >
                      <ListItemIcon>
                        <Icon name={doc.tipo_arquivo === 'pdf' ? 'picture_as_pdf' : 'description'} color="#555" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {doc.nome}
                          </Typography>
                        }
                        secondary={`Atualizado em: ${new Date(doc.data_atualizacao).toLocaleDateString('pt-BR')}`}
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Visualizar / Baixar">
                          <IconButton 
                            edge="end" 
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Icon name="download" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* Modal de Upload */}
      <DocumentoFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          fetchDocumentos(); // Atualiza a lista caso tenha feito upload de algo
        }}
        categorias={categorias}
      />
    </Box>
  );
};

export default DocumentsPage;