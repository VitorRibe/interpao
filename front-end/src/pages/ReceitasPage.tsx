import React, { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  useReceitas,
  useDeleteReceita,
  useIngredientes,
  useDeleteIngrediente,
} from '../hooks/useRecipes';
import { useCurrentUser } from '../hooks/useCurrentUser';
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
  const { data: currentUser } = useCurrentUser();
  const setorNome = currentUser?.setor?.nome?.toLowerCase() || '';
  
  // Permissão geral de gestão da página
  const isUserAdmin = setorNome === 'administrativo' || currentUser?.is_admin === true;
  const isAtendimento = setorNome === 'atendimento';
  
  // 🔐 REGRA DE NEGÓCIO CORRIGIDA: Apenas setores "Administrativo" ou "Produção"
  // Ignorando a flag técnica de sistema 'is_admin' para esta restrição
  const isProducao = setorNome === 'produção' || setorNome === 'producao';
  const isAdministrativo = setorNome === 'administrativo';
  const canViewInstructions = isAdministrativo || isProducao;

  const { data: receitas, isLoading, isError } = useReceitas();
  const deleteReceita = useDeleteReceita();

  const [receitaForm, setReceitaForm] = useState<{ open: boolean; receita: ReceitaSummary | null }>({ open: false, receita: null });
  const [receitaToDelete, setReceitaToDelete] = useState<ReceitaSummary | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [search, setSearch] = useState('');

  const filteredReceitas = useMemo(() => {
    return (receitas ?? []).filter((r) =>
      r.titulo.toLowerCase().includes(search.toLowerCase())
    );
  }, [receitas, search]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder={`Buscar ${isAtendimento ? 'produto' : 'receita'} pelo nome...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Icon name="search" size={20} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isAtendimento 
              ? 'Consulte os ingredientes de cada produto' 
              : 'Gerencie as receitas, ingredientes e instruções de preparo.'}
          </Typography>
          {isUserAdmin && (
            <Button
              variant="contained"
              startIcon={<Icon name="add" size={18} />}
              onClick={() => setReceitaForm({ open: true, receita: null })}
              sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
            >
              {isAtendimento ? 'Novo Produto' : 'Nova Receita'}
            </Button>
          )}
        </Box>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
      )}

      {isError && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(186,26,26,0.2)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Não foi possível carregar as informações
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (filteredReceitas?.length ?? 0) === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed rgba(212,195,190,0.6)' }}>
          <Icon name="menu_book" size={44} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
            Nenhum registo encontrado
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredReceitas.map((receita) => (
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
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {receita.item_count} {receita.item_count === 1 ? 'ingrediente' : 'ingredientes'}
                      {!isAtendimento && receita.tempo_preparo ? ` · ${receita.tempo_preparo} min` : ''}
                      {!isAtendimento && receita.porcoes ? ` · ${receita.porcoes} porções` : ''}
                    </Typography>
                  </Box>
                </Box>
                {isUserAdmin && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => setReceitaForm({ open: true, receita })} sx={{ color: 'primary.main' }}>
                        <Icon name="edit" size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" onClick={() => setReceitaToDelete(receita)} sx={{ color: 'error.main' }}>
                        <Icon name="delete" size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              {expanded === receita.id_receita && (
                <ItensManager 
                  receitaId={receita.id_receita} 
                  readOnly={!isUserAdmin} 
                  isAtendimento={isAtendimento}
                  canViewInstructions={canViewInstructions} 
                />
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {isUserAdmin && (
        <>
          <ReceitaFormDialog
            open={receitaForm.open}
            receita={receitaForm.receita}
            onClose={() => setReceitaForm({ open: false, receita: null })}
          />
          <ConfirmDialog
            open={Boolean(receitaToDelete)}
            title="Excluir receita"
            message={`Excluir "${receitaToDelete?.titulo}"?`}
            loading={deleteReceita.isPending}
            onConfirm={async () => {
              if (receitaToDelete) {
                await deleteReceita.mutateAsync(receitaToDelete.id_receita);
                setReceitaToDelete(null);
              }
            }}
            onClose={() => setReceitaToDelete(null)}
          />
        </>
      )}
    </Box>
  );
};

// ─── Ingredientes tab ──────────────────────────────────────────────────────────

const IngredientesTab: React.FC = () => {
  const { data: currentUser } = useCurrentUser();
  const isUserAdmin = currentUser?.setor?.nome?.toLowerCase() === 'administrativo' || currentUser?.is_admin === true;

  const { data: ingredientes } = useIngredientes();
  const deleteIngrediente = useDeleteIngrediente();

  const [ingrForm, setIngrForm] = useState<{ open: boolean; ingrediente: Ingrediente | null }>({ open: false, ingrediente: null });
  const [ingrToDelete, setIngrToDelete] = useState<Ingrediente | null>(null);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Cadastre os ingredientes que podem ser usados nas receitas.
        </Typography>
        {isUserAdmin && (
          <Button
            variant="contained"
            startIcon={<Icon name="add" size={18} />}
            onClick={() => setIngrForm({ open: true, ingrediente: null })}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            Novo Ingrediente
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {(ingredientes ?? []).map((ingr) => (
          <Paper key={ingr.id_ingr} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {ingr.nome}
              </Typography>
              {isUserAdmin && (
                <IconButton size="small" onClick={() => setIngrToDelete(ingr)} sx={{ color: 'error.main' }}>
                    <Icon name="delete" size={18} />
                </IconButton>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {isUserAdmin && (
        <>
          <IngredienteFormDialog open={ingrForm.open} ingrediente={ingrForm.ingrediente} onClose={() => setIngrForm({ open: false, ingrediente: null })} />
          <ConfirmDialog open={Boolean(ingrToDelete)} title="Excluir" message="Confirmar exclusão?" onConfirm={async () => { if(ingrToDelete) { await deleteIngrediente.mutateAsync(ingrToDelete.id_ingr); setIngrToDelete(null); } }} onClose={() => setIngrToDelete(null)} />
        </>
      )}
    </Box>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const ReceitasPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const { data: currentUser } = useCurrentUser();
  const isAtendimento = currentUser?.setor?.nome?.toLowerCase() === 'atendimento';
  const isUserAdmin = currentUser?.setor?.nome?.toLowerCase() === 'administrativo' || currentUser?.is_admin === true;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isAtendimento ? 'Produtos' : 'Receitas'}
        </Typography>
      </Box>

      {isUserAdmin && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
            <Tab icon={<Icon name="menu_book" size={20} />} iconPosition="start" label="Receitas" />
            <Tab icon={<Icon name="grocery" size={20} />} iconPosition="start" label="Ingredientes" />
          </Tabs>
        </Box>
      )}

      {tab === 0 && <ReceitasTab />}
      {tab === 1 && !isAtendimento && <IngredientesTab />}
    </Box>
  );
};

export default ReceitasPage;