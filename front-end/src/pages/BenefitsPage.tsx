import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  alpha,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
} from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { benefitsApi } from '../api/benefits';
import type { Benefit, BenefitCreate } from '../api/benefits';
import { adminApi } from '../api/admin';
import type { AdminUser } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({
  name, size = 24, style,
}) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

const AVAILABLE_ICONS = [
  'medical_services',
  'fitness_center',
  'restaurant',
  'admin_panel_settings',
  'local_pharmacy',
  'directions_bus',
  'school',
  'credit_card',
  'volunteer_activism',
  'commute',
  'card_membership',
  'work'
];

// ─── Status chip ──────────────────────────────────────────────────────────────

const StatusChip: React.FC<{ status: 'active' | 'available' }> = ({ status }) => {
  if (status === 'active') {
    return (
      <Chip
        label="Ativo"
        size="small"
        sx={{
          height: 24,
          fontSize: '0.6rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          bgcolor: 'rgba(0, 104, 48, 0.1)',
          color: '#006830',
          borderRadius: '999px',
        }}
      />
    );
  }
  return (
    <Chip
      label="Disponível"
      size="small"
      sx={{
        height: 24,
        fontSize: '0.6rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        bgcolor: alpha('#ffb632', 0.25),
        color: '#614000',
        borderRadius: '999px',
      }}
    />
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const BenefitsPage: React.FC = () => {
  const theme = useTheme();
  const { data: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.is_admin;

  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [detailBenefit, setDetailBenefit] = useState<Benefit | null>(null);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Form Fields
  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formComoUsar, setFormComoUsar] = useState('');
  const [formCategoria, setFormCategoria] = useState('');
  const [formIcone, setFormIcone] = useState('medical_services');
  const [formDetalhesPadrao, setFormDetalhesPadrao] = useState('');

  // Employee Selection & Assignment
  const [employees, setEmployees] = useState<AdminUser[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [empBenefits, setEmpBenefits] = useState<Benefit[]>([]);
  const [assignedMap, setAssignedMap] = useState<Record<string, { active: boolean; val: string }>>({});
  
  // Pending changes for confirmation modal
  const [pendingChanges, setPendingChanges] = useState<Array<{ benefitId: string; active: boolean; val: string }>>([]);

  const loadBenefits = async () => {
    try {
      setLoading(true);
      const data = await benefitsApi.listMyBenefits();
      setBenefits(data);
    } catch (err) {
      console.error('Error loading benefits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenefits();
  }, []);

  useEffect(() => {
    if (isManageOpen && isAdmin) {
      const fetchEmployees = async () => {
        try {
          const res = await adminApi.listUsers(0, 100);
          setEmployees(res.users);
        } catch (err) {
          console.error('Error listing employees:', err);
        }
      };
      fetchEmployees();
    }
  }, [isManageOpen, isAdmin]);

  const handleOpenForm = (benefit?: Benefit) => {
    if (benefit) {
      setEditingBenefit(benefit);
      setFormTitulo(benefit.titulo);
      setFormDescricao(benefit.descricao || '');
      setFormComoUsar(benefit.como_usar || '');
      setFormCategoria(benefit.categoria);
      setFormIcone(benefit.icone);
      setFormDetalhesPadrao(benefit.detalhes_padrao || '');
    } else {
      setEditingBenefit(null);
      setFormTitulo('');
      setFormDescricao('');
      setFormComoUsar('');
      setFormCategoria('');
      setFormIcone('medical_services');
      setFormDetalhesPadrao('');
    }
    setIsFormOpen(true);
  };

  const handleSaveBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BenefitCreate = {
      titulo: formTitulo,
      descricao: formDescricao || null,
      como_usar: formComoUsar || null,
      categoria: formCategoria,
      icone: formIcone,
      detalhes_padrao: formDetalhesPadrao || null,
    };

    try {
      if (editingBenefit) {
        await benefitsApi.updateBenefit(editingBenefit.id_beneficio, payload);
      } else {
        await benefitsApi.createBenefit(payload);
      }
      setIsFormOpen(false);
      loadBenefits();
    } catch (err) {
      console.error('Error saving benefit:', err);
    }
  };

  const handleDeleteBenefit = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este benefício?')) return;
    try {
      await benefitsApi.deleteBenefit(id);
      loadBenefits();
    } catch (err) {
      console.error('Error deleting benefit:', err);
    }
  };

  const handleEmployeeChange = async (empId: string) => {
    setSelectedEmpId(empId);
    if (!empId) {
      setEmpBenefits([]);
      setAssignedMap({});
      return;
    }

    try {
      const data = await benefitsApi.listUserBenefits(empId);
      setEmpBenefits(data);
      const initialMap: Record<string, { active: boolean; val: string }> = {};
      data.forEach((b) => {
        initialMap[b.id_beneficio] = {
          active: b.is_active,
          val: b.valor_customizado || '',
        };
      });
      setAssignedMap(initialMap);
    } catch (err) {
      console.error('Error fetching user benefits:', err);
    }
  };

  const handleToggleAssign = (benefitId: string, checked: boolean) => {
    setAssignedMap((prev) => {
      const existing = prev[benefitId] || { active: false, val: '' };
      const benefit = empBenefits.find((b) => b.id_beneficio === benefitId);
      const defaultVal = benefit?.detalhes_padrao || '';
      return {
        ...prev,
        [benefitId]: {
          ...existing,
          active: checked,
          val: checked && !existing.val ? defaultVal : existing.val,
        },
      };
    });
  };

  const handleValChange = (benefitId: string, val: string) => {
    setAssignedMap((prev) => ({
      ...prev,
      [benefitId]: {
        ...prev[benefitId],
        val,
      },
    }));
  };

  const handleRequestSaveAssignments = () => {
    // Determine what has changed compared to initial empBenefits
    const changes: typeof pendingChanges = [];
    empBenefits.forEach((orig) => {
      const current = assignedMap[orig.id_beneficio];
      if (
        current &&
        (current.active !== orig.is_active || current.val !== (orig.valor_customizado || ''))
      ) {
        changes.push({
          benefitId: orig.id_beneficio,
          active: current.active,
          val: current.val,
        });
      }
    });

    if (changes.length === 0) {
      setIsManageOpen(false);
      return;
    }

    setPendingChanges(changes);
    setIsConfirmOpen(true);
  };

  const handleConfirmSaveAssignments = async () => {
    try {
      for (const change of pendingChanges) {
        if (change.active) {
          await benefitsApi.assignBenefit(selectedEmpId, change.benefitId, change.val);
        } else {
          await benefitsApi.unassignBenefit(selectedEmpId, change.benefitId);
        }
      }
      setIsConfirmOpen(false);
      setIsManageOpen(false);
      loadBenefits();
    } catch (err) {
      console.error('Error saving assignments:', err);
    }
  };

  const getSelectedEmpName = () => {
    const emp = employees.find((e) => e.id === selectedEmpId);
    return emp ? emp.name : '';
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
      {/* Section Header */}
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              fontFamily: '"Manrope", sans-serif',
              mb: 0.5,
            }}
          >
            Seus Benefícios
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Consulte seus benefícios ativos e veja como utilizá-los.
          </Typography>
        </Box>

        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<Icon name="settings_suggest" size={18} />}
              onClick={() => {
                setSelectedEmpId('');
                setEmpBenefits([]);
                setAssignedMap({});
                setIsManageOpen(true);
              }}
              sx={{
                borderColor: 'divider',
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '10px',
                '&:hover': { bgcolor: 'background.default', borderColor: 'divider' },
              }}
            >
              Gerenciar Funcionários
            </Button>
            <Button
              variant="contained"
              startIcon={<Icon name="add" size={18} />}
              onClick={() => handleOpenForm()}
              sx={{
                bgcolor: 'primary.main',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: '10px',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Novo Benefício
            </Button>
          </Box>
        )}
      </Box>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
      ) : benefits.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ color: 'text.secondary' }}>
            Nenhum benefício cadastrado no momento.
          </Typography>
        </Paper>
      ) : (
        /* Benefits List */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {benefits.map((benefit) => {
            const isAvailableOnly = !benefit.is_active;

            return (
              <Paper
                key={benefit.id_beneficio}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  opacity: isAvailableOnly ? 0.75 : 1,
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
                    transform: 'translateY(-2px)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => setDetailBenefit(benefit)}
              >
                {/* Left accent panel */}
                <Box
                  sx={{
                    width: { md: 192 },
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: { md: '1px solid' },
                    borderBottom: { xs: '1px solid', md: 'none' },
                    borderColor: 'divider',
                    minHeight: { xs: 'auto', md: 140 },
                    gap: 1,
                  }}
                >
                  <Icon
                    name={benefit.icone}
                    size={38}
                    style={{ color: theme.palette.primary.main }}
                  />
                  <Typography
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      color: 'secondary.main',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      textAlign: 'center',
                    }}
                  >
                    {benefit.categoria}
                  </Typography>
                </Box>

                {/* Right content */}
                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {/* Header row */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          color: 'primary.main',
                          fontFamily: '"Manrope", sans-serif',
                        }}
                      >
                        {benefit.titulo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {benefit.descricao || 'Sem descrição fornecida.'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusChip status={benefit.is_active ? 'active' : 'available'} />
                      {isAdmin && (
                        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenForm(benefit)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Icon name="edit" size={18} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteBenefit(benefit.id_beneficio)}
                            sx={{ color: 'error.main' }}
                          >
                            <Icon name="delete" size={18} />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Active specific value information */}
                  {benefit.is_active && benefit.valor_customizado && (() => {
                    const items = benefit.valor_customizado
                      ? benefit.valor_customizado.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean)
                      : [];
                    
                    if (items.length === 0) return null;

                    return (
                      <Box
                        sx={{
                          pt: 2,
                          mt: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 1.25,
                        }}
                      >
                        {items.map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}
                          >
                            <Icon
                              name="check_circle"
                              size={16}
                              style={{ color: '#7f5600', marginTop: 2, flexShrink: 0 }}
                            />
                            <Typography
                              sx={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: 'primary.main',
                                lineHeight: 1.4,
                              }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })()}
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ─── Detail Dialog ──────────────────────────────────────────────────────── */}
      <Dialog
        open={Boolean(detailBenefit)}
        onClose={() => setDetailBenefit(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        {detailBenefit && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
              <Icon name={detailBenefit.icone} size={28} style={{ color: theme.palette.primary.main }} />
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.15rem', color: 'primary.main', lineHeight: 1.2 }}>
                  {detailBenefit.titulo}
                </Typography>
                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {detailBenefit.categoria}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'divider', py: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  Descrição do Benefício
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                  {detailBenefit.descricao || 'Sem descrição cadastrada.'}
                </Typography>
              </Box>

              {detailBenefit.is_active && detailBenefit.valor_customizado && (() => {
                const items = detailBenefit.valor_customizado
                  ? detailBenefit.valor_customizado.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean)
                  : [];
                if (items.length === 0) return null;
                return (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      Seus Detalhes do Benefício
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.secondary.main, 0.06),
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.secondary.main, 0.15),
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 1.25,
                      }}
                    >
                      {items.map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}
                        >
                          <Icon
                            name="check_circle"
                            size={16}
                            style={{ color: '#7f5600', marginTop: 2, flexShrink: 0 }}
                          />
                          <Typography
                            sx={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'primary.main',
                              lineHeight: 1.4,
                            }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })()}

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '10px', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Icon name="help_center" size={18} style={{ color: theme.palette.primary.main }} />
                  Como Utilizar
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {detailBenefit.como_usar || 'Sem instruções de uso cadastradas no momento.'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
              <Button
                variant="contained"
                onClick={() => setDetailBenefit(null)}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800 }}
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Benefit Form Dialog (Create / Edit) ────────────────────────────── */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          {editingBenefit ? 'Editar Benefício' : 'Novo Benefício'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveBenefit}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 3 }}>
            <TextField
              label="Título"
              value={formTitulo}
              onChange={(e) => setFormTitulo(e.target.value)}
              fullWidth
              required
              slotProps={{ input: { sx: { borderRadius: '8px' } } }}
            />
            <TextField
              label="Subtítulo / Categoria"
              placeholder="Ex: Saúde, Alimentação, Bem-estar"
              value={formCategoria}
              onChange={(e) => setFormCategoria(e.target.value)}
              fullWidth
              required
              slotProps={{ input: { sx: { borderRadius: '8px' } } }}
            />
            <TextField
              label="Descrição"
              value={formDescricao}
              onChange={(e) => setFormDescricao(e.target.value)}
              fullWidth
              multiline
              rows={2}
              slotProps={{ input: { sx: { borderRadius: '8px' } } }}
            />
            <TextField
              label="Como Usar"
              value={formComoUsar}
              onChange={(e) => setFormComoUsar(e.target.value)}
              fullWidth
              multiline
              rows={3}
              slotProps={{ input: { sx: { borderRadius: '8px' } } }}
            />

            <TextField
              label="Dados Personalizados Padrão"
              placeholder="Ex: Cartão Alimentação, Número da Carteirinha, Via (Separados por vírgula ou quebra de linha)"
              value={formDetalhesPadrao}
              onChange={(e) => setFormDetalhesPadrao(e.target.value)}
              fullWidth
              multiline
              rows={3}
              slotProps={{ input: { sx: { borderRadius: '8px' } } }}
            />

            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: 'primary.main', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Selecione o Ícone
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1.5, bgcolor: '#f4f3f2', borderRadius: '10px' }}>
                {AVAILABLE_ICONS.map((iconName) => {
                  const isSelected = formIcone === iconName;
                  return (
                    <IconButton
                      key={iconName}
                      type="button"
                      onClick={() => setFormIcone(iconName)}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: isSelected ? 'secondary.main' : 'transparent',
                        bgcolor: isSelected ? 'secondary.main' : 'transparent',
                        color: isSelected ? '#ffffff' : 'primary.main',
                        '&:hover': {
                          bgcolor: isSelected ? 'secondary.main' : 'rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <Icon name={iconName} size={20} />
                    </IconButton>
                  );
                })}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setIsFormOpen(false)}
              sx={{ textTransform: 'none', fontWeight: 800, color: 'text.secondary' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800 }}
            >
              Salvar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ─── Manage Employee Benefits Dialog ────────────────────────────── */}
      <Dialog
        open={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          Gerenciar Benefícios de Funcionários
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 3, minHeight: 350 }}>
          {/* Employee Selection */}
          <FormControl fullWidth>
            <InputLabel id="select-emp-label">Selecione o Funcionário</InputLabel>
            <Select
              labelId="select-emp-label"
              value={selectedEmpId}
              label="Selecione o Funcionário"
              onChange={(e) => handleEmployeeChange(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="">
                <em>Nenhum selecionado</em>
              </MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedEmpId && empBenefits.length > 0 && (
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'primary.main', mb: 2 }}>
                Atribuição de Benefícios para {getSelectedEmpName()}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {empBenefits.map((b) => {
                  const state = assignedMap[b.id_beneficio] || { active: false, val: '' };

                  return (
                    <Paper
                      key={b.id_beneficio}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={state.active}
                              onChange={(e) => handleToggleAssign(b.id_beneficio, e.target.checked)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Icon name={b.icone} size={20} style={{ color: theme.palette.primary.main }} />
                              <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'primary.main' }}>
                                  {b.titulo}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {b.categoria}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        {state.active && (
                          <TextField
                            size="small"
                            label="Valor/Dados Personalizados"
                            placeholder={b.detalhes_padrao || "Ex: R$ 850,00 ou Carteira 123"}
                            value={state.val}
                            onChange={(e) => handleValChange(b.id_beneficio, e.target.value)}
                            sx={{ minWidth: 280 }}
                            slotProps={{ input: { sx: { borderRadius: '8px' } } }}
                            multiline
                            maxRows={3}
                          />
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setIsManageOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 800, color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRequestSaveAssignments}
            variant="contained"
            disabled={!selectedEmpId}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800 }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Confirmation Modal ────────────────────────────── */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        slotProps={{ paper: { sx: { borderRadius: '12px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          Confirmar Alterações
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            Você tem certeza que deseja atualizar a lista de benefícios ativos de <strong>{getSelectedEmpName()}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button
            onClick={() => setIsConfirmOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 800, color: 'text.secondary' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSaveAssignments}
            variant="contained"
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 800 }}
          >
            Confirmar e Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BenefitsPage;
