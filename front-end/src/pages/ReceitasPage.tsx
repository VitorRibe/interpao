import React, { useState } from 'react';
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
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  useReceitas,
  useDeleteReceita,
  useIngredientes,
  useDeleteIngrediente,
} from '../hooks/useRecipes';
import type { Ingrediente, ReceitaSummary } from '../types';
import ReceitaFormDialog from '../components/admin/ReceitaFormDialog';
import IngredienteFormDialog from '../components/admin/IngredienteFormDialog';
import ItensManager from '../components/admin/ItensManager';
import ConfirmDialog from '../components/admin/ConfirmDialog';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

// ─── Receitas tab ──────────────────────────────────────────────────────────────

const ReceitasTab: React.FC = () => {
  const { data: receitas, isLoading, isError } = useReceitas();
  const deleteReceita = useDeleteReceita();

  const [receitaForm, setReceitaForm] = useState<{ open: boolean; receita: ReceitaSummary | null }>({ open: false, receita: null });
  const [receitaToDelete, setReceitaToDelete] = useState<ReceitaSummary | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gerencie as receitas, ingredientes e instruções de preparo.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon name="add" size={18} />}
          onClick={() => setReceitaForm({ open: true, receita: null })}
          sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Nova Receita
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
            Não foi possível carregar as receitas
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (receitas?.length ?? 0) === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed rgba(212,195,190,0.6)' }}>
          <Icon name="menu_book" size={44} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
            Comece criando sua primeira receita
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            As receitas ficam disponíveis para os setores vinculados.
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(receitas ?? []).map((receita) => (
          <Accordion
            key={receita.id_receita}
            expanded={expanded === receita.id_receita}
            onChange={(_e, isExpanded) => setExpanded(isExpanded ? receita.id_receita : false)}
          >
            <AccordionSummary expandIcon={<Icon name="expand_more" />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, pr: 2 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: 'primary.main' }} noWrap>
                    {receita.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                    {receita.setores.map((s) => (
                      <Chip key={s.id_setor} label={s.nome} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    ))}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {receita.item_count} {receita.item_count === 1 ? 'ingrediente' : 'ingredientes'}
                      {receita.tempo_preparo ? ` · ${receita.tempo_preparo} min` : ''}
                      {receita.porcoes ? ` · ${receita.porcoes} porções` : ''}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Editar receita">
                    <IconButton size="small" onClick={() => setReceitaForm({ open: true, receita })} sx={{ color: 'primary.main' }}>
                      <Icon name="edit" size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir receita">
                    <IconButton size="small" onClick={() => setReceitaToDelete(receita)} sx={{ color: 'error.main' }}>
                      <Icon name="delete" size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              {expanded === receita.id_receita && <ItensManager receitaId={receita.id_receita} />}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialogs */}
      <ReceitaFormDialog
        open={receitaForm.open}
        receita={receitaForm.receita}
        onClose={() => setReceitaForm({ open: false, receita: null })}
      />
      <ConfirmDialog
        open={Boolean(receitaToDelete)}
        title="Excluir receita"
        message={`Excluir "${receitaToDelete?.titulo}"? Todos os ingredientes e vínculos desta receita serão removidos permanentemente.`}
        loading={deleteReceita.isPending}
        onConfirm={async () => {
          if (receitaToDelete) {
            await deleteReceita.mutateAsync(receitaToDelete.id_receita);
            setReceitaToDelete(null);
          }
        }}
        onClose={() => setReceitaToDelete(null)}
      />
    </Box>
  );
};

// ─── Ingredientes tab ──────────────────────────────────────────────────────────

const IngredientesTab: React.FC = () => {
  const { data: ingredientes, isLoading, isError } = useIngredientes();
  const deleteIngrediente = useDeleteIngrediente();

  const [ingrForm, setIngrForm] = useState<{ open: boolean; ingrediente: Ingrediente | null }>({ open: false, ingrediente: null });
  const [ingrToDelete, setIngrToDelete] = useState<Ingrediente | null>(null);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cadastre os ingredientes que podem ser usados nas receitas.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon name="add" size={18} />}
          onClick={() => setIngrForm({ open: true, ingrediente: null })}
          sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Novo Ingrediente
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
            Não foi possível carregar os ingredientes
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (ingredientes?.length ?? 0) === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed rgba(212,195,190,0.6)' }}>
          <Icon name="grocery" size={44} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
            Nenhum ingrediente cadastrado
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cadastre ingredientes para poder adicioná-los às receitas.
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(ingredientes ?? []).map((ingr) => (
          <Paper key={ingr.id_ingr} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                <Icon name="grocery" size={20} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }} noWrap>
                    {ingr.nome}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Unidade: {ingr.unidade_med}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title="Editar ingrediente">
                  <IconButton size="small" onClick={() => setIngrForm({ open: true, ingrediente: ingr })} sx={{ color: 'primary.main' }}>
                    <Icon name="edit" size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir ingrediente">
                  <IconButton size="small" onClick={() => setIngrToDelete(ingr)} sx={{ color: 'error.main' }}>
                    <Icon name="delete" size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Dialogs */}
      <IngredienteFormDialog
        open={ingrForm.open}
        ingrediente={ingrForm.ingrediente}
        onClose={() => setIngrForm({ open: false, ingrediente: null })}
      />
      <ConfirmDialog
        open={Boolean(ingrToDelete)}
        title="Excluir ingrediente"
        message={`Excluir "${ingrToDelete?.nome}"? Receitas que usam este ingrediente serão afetadas.`}
        loading={deleteIngrediente.isPending}
        onConfirm={async () => {
          if (ingrToDelete) {
            await deleteIngrediente.mutateAsync(ingrToDelete.id_ingr);
            setIngrToDelete(null);
          }
        }}
        onClose={() => setIngrToDelete(null)}
      />
    </Box>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const ReceitasPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Receitas
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gerencie receitas, ingredientes e vínculos com setores.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_e, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'secondary.main',
                fontWeight: 800,
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: 'secondary.main',
            },
          }}
        >
          <Tab icon={<Icon name="menu_book" size={20} />} iconPosition="start" label="Receitas" />
          <Tab icon={<Icon name="grocery" size={20} />} iconPosition="start" label="Ingredientes" />
        </Tabs>
      </Box>

      {tab === 0 && <ReceitasTab />}
      {tab === 1 && <IngredientesTab />}
    </Box>
  );
};

export default ReceitasPage;
