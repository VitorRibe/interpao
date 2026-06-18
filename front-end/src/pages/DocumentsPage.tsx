import React, { useState, useMemo } from 'react';
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
  Button
} from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import DocumentoFormDialog from '../components/admin/DocumentoFormDialog';

const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 20, color }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color }}>{name}</span>
);

const DocumentsPage: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const isUserAdmin = currentUser?.setor?.nome?.toLowerCase() === 'administrativo' || currentUser?.is_admin === true;

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const categoriasMock = [
    {
      id_categoria: '1',
      titulo: 'Recursos Humanos',
      documentos: [
        { id: '101', nome: 'Código de Ética 2024', tipo: 'pdf', data: '10/01/2024' },
        { id: '102', nome: 'Manual do Colaborador', tipo: 'pdf', data: '15/02/2024' },
      ]
    },
    {
      id_categoria: '2',
      titulo: 'Segurança do Trabalho',
      documentos: [
        { id: '201', nome: 'Uso de EPIs', tipo: 'pdf', data: '05/03/2024' },
      ]
    }
  ];

  const filteredCategorias = useMemo(() => {
    return categoriasMock.filter(cat => 
      cat.titulo.toLowerCase().includes(search.toLowerCase()) ||
      cat.documentos.some(doc => doc.nome.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

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
        {filteredCategorias.map((cat) => (
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
                    key={doc.id} 
                    divider 
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      cursor: 'pointer' 
                    }}
                  >
                    <ListItemIcon>
                      <Icon name="description" color="#555" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {doc.nome}
                        </Typography>
                      }
                      secondary={`Atualizado em: ${doc.data}`}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Visualizar / Baixar">
                        <IconButton edge="end">
                          <Icon name="download" />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Modal de Upload */}
      <DocumentoFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categorias={categoriasMock}
      />
    </Box>
  );
};

export default DocumentsPage;