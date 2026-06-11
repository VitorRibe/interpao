import React, { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  useReceita,
  useIngredientes,
  useReceitaSetores,
  useAddItemReceita,
  useUpdateItemReceita,
  useRemoveItemReceita,
  useAddSetorReceita,
  useRemoveSetorReceita,
} from '../../hooks/useRecipes';
import type { Ingrediente, ItemReceita } from '../../types';
import ConfirmDialog from './ConfirmDialog';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 18 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const ItensManager: React.FC<{ receitaId: string }> = ({ receitaId }) => {
  const { data: receita, isLoading } = useReceita(receitaId);
  const { data: allIngredientes } = useIngredientes();
  const { data: allSetores } = useReceitaSetores();
  const addItem = useAddItemReceita(receitaId);
  const updateItem = useUpdateItemReceita(receitaId);
  const removeItem = useRemoveItemReceita(receitaId);
  const addSetor = useAddSetorReceita(receitaId);
  const removeSetor = useRemoveSetorReceita(receitaId);

  // Add item form state
  const [selectedIngr, setSelectedIngr] = useState<Ingrediente | null>(null);
  const [qtd, setQtd] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Edit item state
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQtd, setEditQtd] = useState('');

  // Delete confirmation
  const [itemToDelete, setItemToDelete] = useState<ItemReceita | null>(null);

  // Setor picker
  const [setorToAdd, setSetorToAdd] = useState('');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={24} sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  const itens = receita?.itens ?? [];
  const receitaSetores = receita?.setores ?? [];

  // Filter out already-added ingredientes
  const availableIngredientes = (allIngredientes ?? []).filter(
    (ing) => !itens.some((item) => item.id_ingr === ing.id_ingr),
  );

  // Filter out already-added setores
  const availableSetores = (allSetores ?? []).filter(
    (s) => !receitaSetores.some((rs) => rs.id_setor === s.id_setor),
  );

  const handleAddItem = async () => {
    if (!selectedIngr || !qtd) return;
    setAddError(null);
    try {
      await addItem.mutateAsync({ id_ingr: selectedIngr.id_ingr, qtd: Number(qtd) });
      setSelectedIngr(null);
      setQtd('');
    } catch (err: any) {
      setAddError(err.response?.data?.detail || 'Erro ao adicionar ingrediente.');
    }
  };

  const handleUpdateItem = async (ingrId: string) => {
    if (!editQtd) return;
    await updateItem.mutateAsync({ ingrId, qtd: Number(editQtd) });
    setEditingItem(null);
  };

  const handleAddSetor = async () => {
    if (!setorToAdd) return;
    await addSetor.mutateAsync(setorToAdd);
    setSetorToAdd('');
  };

  return (
    <Box>
      {/* ── Instruções de Preparo ── */}
      {receita?.inst_preparo && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(127,86,0,0.04)', borderRadius: 2, border: '1px solid rgba(212,195,190,0.3)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
            Instruções de Preparo
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {receita.inst_preparo}
          </Typography>
        </Box>
      )}

      {/* ── Setores vinculados ── */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
          Setores Vinculados
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
          {receitaSetores.map((s) => (
            <Chip
              key={s.id_setor}
              label={s.nome}
              size="small"
              onDelete={() => removeSetor.mutate(s.id_setor)}
              sx={{ fontWeight: 700, bgcolor: 'rgba(127,86,0,0.1)', color: 'secondary.main' }}
            />
          ))}
          {receitaSetores.length === 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Nenhum setor vinculado.
            </Typography>
          )}
        </Box>
        {availableSetores.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              label="Adicionar setor"
              value={setorToAdd}
              onChange={(e) => setSetorToAdd(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              {availableSetores.map((s) => (
                <MenuItem key={s.id_setor} value={s.id_setor}>{s.nome}</MenuItem>
              ))}
            </TextField>
            <Button
              size="small"
              variant="outlined"
              onClick={handleAddSetor}
              disabled={!setorToAdd || addSetor.isPending}
              sx={{ textTransform: 'none', fontWeight: 700, borderColor: 'secondary.main', color: 'secondary.main' }}
            >
              Vincular
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Ingredientes ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ingredientes ({itens.length})
        </Typography>
      </Box>

      {/* Add item form */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, borderStyle: 'dashed' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Autocomplete
            size="small"
            options={availableIngredientes}
            getOptionLabel={(opt) => `${opt.nome} (${opt.unidade_med})`}
            value={selectedIngr}
            onChange={(_e, val) => setSelectedIngr(val)}
            renderInput={(params) => <TextField {...params} label="Ingrediente" />}
            sx={{ flex: 2, minWidth: 200 }}
            noOptionsText="Nenhum ingrediente disponível"
          />
          <TextField
            size="small"
            label="Quantidade"
            value={qtd}
            onChange={(e) => setQtd(e.target.value.replace(/[^0-9.,]/g, ''))}
            sx={{ flex: 1, minWidth: 100 }}
          />
          <Button
            size="small"
            variant="contained"
            startIcon={<Icon name="add" size={16} />}
            onClick={handleAddItem}
            disabled={!selectedIngr || !qtd || addItem.isPending}
            sx={{ textTransform: 'none', fontWeight: 700, bgcolor: 'secondary.main', mt: '1px', height: 40 }}
          >
            Adicionar
          </Button>
        </Box>
        {addError && (
          <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
            {addError}
          </Typography>
        )}
      </Paper>

      {itens.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', py: 1 }}>
          Nenhum ingrediente adicionado à receita.
        </Typography>
      )}

      {/* Items list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {itens.map((item) => (
          <Paper key={item.id_ingr} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                <Icon name="grocery" size={20} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }} noWrap>
                    {item.nome}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {editingItem === item.id_ingr ? '' : `${item.qtd} ${item.unidade_med}`}
                  </Typography>
                </Box>
              </Box>

              {editingItem === item.id_ingr ? (
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    value={editQtd}
                    onChange={(e) => setEditQtd(e.target.value.replace(/[^0-9.,]/g, ''))}
                    sx={{ width: 100 }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateItem(item.id_ingr);
                      if (e.key === 'Escape') setEditingItem(null);
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.unidade_med}</Typography>
                  <IconButton size="small" onClick={() => handleUpdateItem(item.id_ingr)} sx={{ color: 'success.main' }}>
                    <Icon name="check" size={18} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setEditingItem(null)} sx={{ color: 'text.secondary' }}>
                    <Icon name="close" size={18} />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  <Tooltip title="Editar quantidade">
                    <IconButton
                      size="small"
                      onClick={() => { setEditingItem(item.id_ingr); setEditQtd(String(item.qtd)); }}
                      sx={{ color: 'primary.main' }}
                    >
                      <Icon name="edit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover ingrediente">
                    <IconButton size="small" onClick={() => setItemToDelete(item)} sx={{ color: 'error.main' }}>
                      <Icon name="delete" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        title="Remover ingrediente"
        message={`Remover "${itemToDelete?.nome}" desta receita?`}
        loading={removeItem.isPending}
        onConfirm={async () => {
          if (itemToDelete) {
            await removeItem.mutateAsync(itemToDelete.id_ingr);
            setItemToDelete(null);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />
    </Box>
  );
};

export default ItensManager;
