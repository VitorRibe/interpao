import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTrilha, useDeleteModulo, useDeleteMultimidia } from '../../hooks/useContent';
import type { Modulo, Multimidia } from '../../types';
import ModuloFormDialog from './ModuloFormDialog';
import MultimidiaFormDialog from './MultimidiaFormDialog';
import ConfirmDialog from './ConfirmDialog';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 18 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const ModuloManager: React.FC<{ trilhaId: string }> = ({ trilhaId }) => {
  const { data: trilha, isLoading } = useTrilha(trilhaId);
  const deleteModulo = useDeleteModulo(trilhaId);
  const deleteMultimidia = useDeleteMultimidia(trilhaId);

  const [moduloForm, setModuloForm] = useState<{ open: boolean; modulo: Modulo | null }>({ open: false, modulo: null });
  const [mediaForm, setMediaForm] = useState<{ open: boolean; moduloId: string | null }>({ open: false, moduloId: null });
  const [moduloToDelete, setModuloToDelete] = useState<Modulo | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<Multimidia | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  const modulos = trilha?.modulos ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Módulos ({modulos.length})
        </Typography>
        <Button
          size="small"
          startIcon={<Icon name="add" size={16} />}
          onClick={() => setModuloForm({ open: true, modulo: null })}
          sx={{ textTransform: 'none', fontWeight: 700, color: 'secondary.main' }}
        >
          Adicionar módulo
        </Button>
      </Box>

      {modulos.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 1 }}>
          Nenhum módulo nesta trilha ainda.
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {modulos.map((modulo) => (
          <Paper key={modulo.id_modulo} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                  <Chip
                    label={modulo.ordem ?? '–'}
                    size="small"
                    sx={{ bgcolor: 'rgba(127,86,0,0.1)', color: 'secondary.main', fontWeight: 800, height: 22 }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {modulo.titulo}
                  </Typography>
                  {modulo.duracao != null && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>· {modulo.duracao} min</Typography>
                  )}
                </Box>
                {modulo.descricao && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }} noWrap>
                    {modulo.descricao}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title="Editar módulo">
                  <IconButton size="small" onClick={() => setModuloForm({ open: true, modulo })} sx={{ color: 'primary.main' }}>
                    <Icon name="edit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir módulo">
                  <IconButton size="small" onClick={() => setModuloToDelete(modulo)} sx={{ color: 'error.main' }}>
                    <Icon name="delete" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Multimídia */}
            <Box sx={{ mt: 1.5, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
              {modulo.multimidia.map((item) => (
                <Box key={item.id_multimidia} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Icon name="attachment" size={16} />
                  <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }} noWrap>
                    {item.titulo}{item.tipo ? ` (${item.tipo})` : ''}
                  </Typography>
                  <IconButton size="small" onClick={() => setMediaToDelete(item)} sx={{ color: 'error.main' }}>
                    <Icon name="close" size={16} />
                  </IconButton>
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<Icon name="add_link" size={16} />}
                onClick={() => setMediaForm({ open: true, moduloId: modulo.id_modulo })}
                sx={{ textTransform: 'none', fontWeight: 700, color: 'text.secondary', mt: 0.5 }}
              >
                Adicionar recurso
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Dialogs */}
      <ModuloFormDialog
        open={moduloForm.open}
        trilhaId={trilhaId}
        modulo={moduloForm.modulo}
        onClose={() => setModuloForm({ open: false, modulo: null })}
      />
      {mediaForm.moduloId && (
        <MultimidiaFormDialog
          open={mediaForm.open}
          trilhaId={trilhaId}
          moduloId={mediaForm.moduloId}
          onClose={() => setMediaForm({ open: false, moduloId: null })}
        />
      )}
      <ConfirmDialog
        open={Boolean(moduloToDelete)}
        title="Excluir módulo"
        message={`Tem certeza que deseja excluir "${moduloToDelete?.titulo}"? Os recursos vinculados também serão removidos.`}
        loading={deleteModulo.isPending}
        onConfirm={async () => {
          if (moduloToDelete) {
            await deleteModulo.mutateAsync(moduloToDelete.id_modulo);
            setModuloToDelete(null);
          }
        }}
        onClose={() => setModuloToDelete(null)}
      />
      <ConfirmDialog
        open={Boolean(mediaToDelete)}
        title="Excluir recurso"
        message={`Remover o recurso "${mediaToDelete?.titulo}"?`}
        loading={deleteMultimidia.isPending}
        onConfirm={async () => {
          if (mediaToDelete) {
            await deleteMultimidia.mutateAsync(mediaToDelete.id_multimidia);
            setMediaToDelete(null);
          }
        }}
        onClose={() => setMediaToDelete(null)}
      />
    </Box>
  );
};

export default ModuloManager;
