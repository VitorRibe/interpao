import React, { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, IconButton, Grid, Tooltip, alpha } from '@mui/material';
import { useDocumentos, useDeleteDocumento } from '../hooks/useDocumentos';
import { useCurrentUser } from '../hooks/useCurrentUser';
import DocumentoFormDialog from '../components/admin/DocumentoFormDialog';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const DocumentsPage: React.FC = () => {
  const { data: user } = useCurrentUser();
  const { data: categorias, isLoading } = useDocumentos();
  const deleteMutation = useDeleteDocumento();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  const isAdmin = user?.is_admin;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
            Documentos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manuais, políticas e arquivos corporativos.
          </Typography>
        </Box>
        
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Icon name="upload" />}
            onClick={() => setIsDialogOpen(true)}
            sx={{ bgcolor: 'secondary.main', textTransform: 'none', fontWeight: 800 }}
          >
            Novo Documento
          </Button>
        )}
      </Box>

      {!categorias?.length ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }} elevation={0}>
          <Typography sx={{ color: 'text.secondary' }}>Nenhum documento disponível no momento.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {categorias.map((cat) => (
            <Box key={cat.id_categoria}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {cat.titulo}
              </Typography>
              
              <Grid container spacing={2}>
                {cat.documentos.map((doc) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={doc.id_documento}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 3, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        transition: 'transform 0.2s', 
                        '&:hover': { transform: 'translateY(-2px)', borderColor: 'secondary.main' } 
                      }}
                    >
                      <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: alpha('#7f5600', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'secondary.main', flexShrink: 0 }}>
                        <Icon name={doc.tipo_arquivo === 'pdf' ? 'picture_as_pdf' : 'description'} />
                      </Box>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.95rem' }}>
                          {doc.nome}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(doc.data_atualizacao).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Baixar / Visualizar">
                          <IconButton size="small" component="a" href={doc.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'secondary.main' }}>
                            <Icon name="download" />
                          </IconButton>
                        </Tooltip>
                        
                        {isAdmin && (
                          <Tooltip title="Excluir">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                if(window.confirm('Tem certeza que deseja excluir este documento?')) {
                                  deleteMutation.mutate(doc.id_documento);
                                }
                              }} 
                              disabled={deleteMutation.isPending} 
                              sx={{ color: 'error.main' }}
                            >
                              <Icon name="delete" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <DocumentoFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </Box>
  );
};

export default DocumentsPage;