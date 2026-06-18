import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  LinearProgress,
  Chip,
  Skeleton,
  IconButton,
  Collapse,
  alpha,
} from '@mui/material';
import { useProgressoEquipe } from '../hooks/useProgressoEquipe';

// ─── Interfaces de Tipagem ───────────────────────────────────────────────────
interface DetalheTrilha {
  trilha_id: string;
  titulo: string;
  modulos_concluidos: number;
  total_modulos: number;
  progresso_pct: number;
}

interface ProgressoFuncionario {
  user_id: string;
  nome: string;
  setor: string;
  cargo: string | null;
  trilhas_concluidas: number;
  total_trilhas: number;
  progresso_pct: number;
  detalhes_trilhas: DetalheTrilha[];
}

// ─── Componente de Linha Expansível ───────────────────────────────────────────
const Row: React.FC<{ row: ProgressoFuncionario }> = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="5%">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'secondary.main' }}
          >
            <span className="material-symbols-outlined">
              {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{row.nome}</Typography>
          {row.cargo && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.cargo}</Typography>}
        </TableCell>
        <TableCell>
          <Chip label={row.setor} size="small" variant="outlined" sx={{ fontWeight: 600, color: 'text.secondary', borderColor: 'divider' }} />
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontWeight: 800, color: 'secondary.main' }}>
            {row.trilhas_concluidas} / {row.total_trilhas}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress
              variant="determinate"
              value={row.progresso_pct}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: alpha('#c9883d', 0.15),
                '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 4 },
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 800, minWidth: 35 }}>
              {row.progresso_pct.toFixed(0)}%
            </Typography>
          </Box>
        </TableCell>
      </TableRow>

      {/* Linha de Detalhes Expandida */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, pb: 2, pl: 6 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                Desempenho por Trilha de Conhecimento
              </Typography>
              
              <Table size="small" aria-label="trilhas">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', bgcolor: 'transparent' }}>Trilha</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', bgcolor: 'transparent', textAlign: 'center' }}>Módulos Lido</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary', bgcolor: 'transparent', width: '40%' }}>Progresso do Curso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!row.detalhes_trilhas || row.detalhes_trilhas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ color: 'text.secondary', fontStyle: 'italic', py: 1.5 }}>
                        Nenhuma trilha iniciada ou vinculada a este colaborador.
                      </TableCell>
                    </TableRow>
                  ) : (
                    row.detalhes_trilhas.map((trilha) => (
                      <TableRow key={trilha.trilha_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {trilha.titulo}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {trilha.modulos_concluidos} / {trilha.total_modulos}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={trilha.progresso_pct}
                              sx={{
                                flex: 1,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: alpha('#2c1a0e', 0.08),
                                '& .MuiLinearProgress-bar': { 
                                  bgcolor: trilha.progresso_pct === 100 ? '#2e7d32' : 'secondary.light', 
                                  borderRadius: 3 
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 35, color: trilha.progresso_pct === 100 ? '#2e7d32' : 'text.primary' }}>
                              {trilha.progresso_pct.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
const AdminProgressoPage: React.FC = () => {
  const { data: progresso, isLoading, isError } = useProgressoEquipe();
  const [search, setSearch] = useState('');

  const filteredProgresso = useMemo(() => {
    if (!progresso) return [];
    const lowerSearch = search.toLowerCase();
    return (progresso as unknown as ProgressoFuncionario[]).filter(
      (p) =>
        p.nome.toLowerCase().includes(lowerSearch) ||
        p.setor.toLowerCase().includes(lowerSearch)
    );
  }, [progresso, search]);

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Skeleton variant="text" width={300} height={50} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 3, borderRadius: 2 }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color="error" variant="h6">
          Erro ao carregar os dados de progresso.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
            Acompanhamento de Equipe
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Clique em qualquer linha da tabela para analisar o progresso detalhado de cada curso.
          </Typography>
        </Box>

        <TextField
          size="small"
          variant="outlined"
          placeholder="Buscar por nome ou setor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300, bgcolor: 'background.paper', borderRadius: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
        <Table aria-label="tabela de progresso da equipe">
          <TableHead sx={{ bgcolor: alpha('#7f5600', 0.04) }}>
            <TableRow>
              <TableCell width="5%" />
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>Colaborador</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>Setor</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center' }}>Cursos Concluídos</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main', width: '35%' }}>Progresso Geral</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProgresso.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Nenhum registro de colaborador localizado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProgresso.map((row) => (
                <Row key={row.user_id} row={row} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProgressoPage;