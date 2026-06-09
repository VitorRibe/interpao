import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTrilhas, useDeleteTrilha } from '../hooks/useContent';
import type { Setor, TrilhaSummary } from '../types';
import TrilhaFormDialog from '../components/admin/TrilhaFormDialog';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import ModuloManager from '../components/admin/ModuloManager';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const AdminContentPage: React.FC = () => {
  const { data: trilhas, isLoading, isError } = useTrilhas();
  const deleteTrilha = useDeleteTrilha();

  const [trilhaForm, setTrilhaForm] = useState<{ open: boolean; trilha: TrilhaSummary | null }>({ open: false, trilha: null });
  const [trilhaToDelete, setTrilhaToDelete] = useState<TrilhaSummary | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  // No "list setores" endpoint exists yet, so options come from setores
  // already attached to existing trilhas.
  const setores = useMemo<Setor[]>(() => {
    const map = new Map<string, Setor>();
    (trilhas ?? []).forEach((t) => {
      if (t.setor) map.set(t.setor.id_setor, t.setor);
    });
    return Array.from(map.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [trilhas]);

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Gestão de Conteúdo
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Crie e organize trilhas, módulos e recursos de aprendizado.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Icon name="add" size={18} />}
          onClick={() => setTrilhaForm({ open: true, trilha: null })}
          sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Nova Trilha
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
      )}

      {isError && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(186,26,26,0.2)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Não foi possível carregar as trilhas
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (trilhas?.length ?? 0) === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed rgba(212,195,190,0.6)' }}>
          <Icon name="route" size={44} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
            Comece criando sua primeira trilha
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            As trilhas agrupam os módulos que aparecem na Trilha do Conhecimento.
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(trilhas ?? []).map((trilha) => (
          <Accordion
            key={trilha.id_trilha}
            expanded={expanded === trilha.id_trilha}
            onChange={(_e, isExpanded) => setExpanded(isExpanded ? trilha.id_trilha : false)}
          >
            <AccordionSummary expandIcon={<Icon name="expand_more" />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, pr: 2 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main' }} noWrap>
                    {trilha.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    {trilha.setor && (
                      <Chip label={trilha.setor.nome} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    )}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {trilha.module_count} {trilha.module_count === 1 ? 'módulo' : 'módulos'}
                      {trilha.carga_hor ? ` · ${trilha.carga_hor}h` : ''}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Editar trilha">
                    <IconButton size="small" onClick={() => setTrilhaForm({ open: true, trilha })} sx={{ color: 'primary.main' }}>
                      <Icon name="edit" size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir trilha">
                    <IconButton size="small" onClick={() => setTrilhaToDelete(trilha)} sx={{ color: 'error.main' }}>
                      <Icon name="delete" size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              {/* Mount the manager only when expanded to avoid fetching every trilha at once */}
              {expanded === trilha.id_trilha && <ModuloManager trilhaId={trilha.id_trilha} />}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialogs */}
      <TrilhaFormDialog
        open={trilhaForm.open}
        trilha={trilhaForm.trilha}
        setores={setores}
        onClose={() => setTrilhaForm({ open: false, trilha: null })}
      />
      <ConfirmDialog
        open={Boolean(trilhaToDelete)}
        title="Excluir trilha"
        message={`Excluir "${trilhaToDelete?.titulo}"? Todos os módulos e recursos desta trilha serão removidos permanentemente.`}
        loading={deleteTrilha.isPending}
        onConfirm={async () => {
          if (trilhaToDelete) {
            await deleteTrilha.mutateAsync(trilhaToDelete.id_trilha);
            setTrilhaToDelete(null);
          }
        }}
        onClose={() => setTrilhaToDelete(null)}
      />
    </Box>
  );
};

export default AdminContentPage;
