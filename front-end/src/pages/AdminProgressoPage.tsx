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
  alpha,
} from '@mui/material';
import { useProgressoEquipe } from '../hooks/useProgressoEquipe';

const AdminProgressoPage: React.FC = () => {
  const { data: progresso, isLoading, isError } = useProgressoEquipe();
  const [search, setSearch] = useState('');

  const filteredProgresso = useMemo(() => {
    if (!progresso) return [];
    const lowerSearch = search.toLowerCase();
    return progresso.filter(
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
            Progresso da Equipe
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Acompanhe o desenvolvimento e conclusão das trilhas de conhecimento dos colaboradores.
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
        <Table>
          <TableHead sx={{ bgcolor: alpha('#7f5600', 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>Colaborador</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>Setor</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center' }}>Trilhas Concluídas</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'primary.main', width: '30%' }}>Progresso Geral</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProgresso.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProgresso.map((row) => (
                <TableRow key={row.user_id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProgressoPage;