import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useUsers, useDeactivateUser, useResetPassword } from '../hooks/useUsers';
import type { AdminUser } from '../types';
import UserFormDialog from '../components/admin/UserFormDialog';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import EscalaFormDialog from '../components/admin/EscalaFormDialog';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const ROWS_PER_PAGE = 10;

const AdminUsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useUsers(page * ROWS_PER_PAGE, ROWS_PER_PAGE);
  const deactivateUser = useDeactivateUser();
  const resetPassword = useResetPassword();

  const [userForm, setUserForm] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [userToDeactivate, setUserToDeactivate] = useState<AdminUser | null>(null);
  const [tempPassword, setTempPassword] = useState<{ name: string; password: string } | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [escalaUser, setEscalaUser] = useState<AdminUser | null>(null);

  const handleResetPassword = async (user: AdminUser) => {
    setResetError(null);
    try {
      const result = await resetPassword.mutateAsync(user.id);
      setTempPassword({ name: user.name, password: result.temp_password });
    } catch {
      setResetError('Não foi possível redefinir a senha.');
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
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
            Gestão de Usuários
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cadastre, edite e desative contas de colaboradores.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Icon name="person_add" size={18} />}
          onClick={() => setUserForm({ open: true, user: null })}
          sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700, flexShrink: 0 }}
        >
          Novo Usuário
        </Button>
      </Box>

      {resetError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setResetError(null)}>
          {resetError}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
      )}

      {isError && (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(186,26,26,0.2)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Não foi possível carregar os usuários
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Colaborador', 'Cargo', 'Setor', 'Status'].map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(data?.users ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                      <Icon name="group" size={40} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        Nenhum usuário cadastrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  (data?.users ?? []).map((user) => (
                    <TableRow key={user.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      {/* Colaborador */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 700, fontSize: '0.875rem', color: 'text.primary' }}
                            >
                              {user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Cargo */}
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {user.cargo ?? '—'}
                        </Typography>
                      </TableCell>

                      {/* Setor */}
                      <TableCell>
                        <Chip
                          label={user.setor.nome}
                          size="small"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
                        />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={user.is_active ? 'Ativo' : 'Inativo'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: user.is_active
                              ? 'rgba(0, 104, 48, 0.1)'
                              : 'rgba(186, 26, 26, 0.1)',
                            color: user.is_active ? '#006830' : 'error.main',
                          }}
                        />
                      </TableCell>

                      {/* Ações */}
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => setUserForm({ open: true, user })}
                              sx={{ color: 'primary.main' }}
                            >
                              <Icon name="edit" size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Editar escala">
                            <IconButton
                              size="small"
                              onClick={() => setEscalaUser(user)}
                              sx={{ color: 'primary.main' }}
                            >
                              <Icon name="calendar_month" size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Redefinir senha">
                            <IconButton
                              size="small"
                              onClick={() => handleResetPassword(user)}
                              disabled={resetPassword.isPending}
                              sx={{ color: 'secondary.main' }}
                            >
                              <Icon name="lock_reset" size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={user.is_active ? 'Desativar' : 'Já inativo'}>
                            {/* span wrapper keeps Tooltip working on disabled buttons */}
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => setUserToDeactivate(user)}
                                disabled={!user.is_active}
                                sx={{ color: 'error.main' }}
                              >
                                <Icon name="person_off" size={18} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ROWS_PER_PAGE]}
            onPageChange={(_e, newPage) => setPage(newPage)}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </Paper>
      )}

      {/* Create / Edit dialog */}
      <UserFormDialog
        open={userForm.open}
        user={userForm.user}
        onClose={() => setUserForm({ open: false, user: null })}
      />

      {/* Deactivate confirm dialog */}
      <ConfirmDialog
        open={Boolean(userToDeactivate)}
        title="Desativar usuário"
        message={`Desativar "${userToDeactivate?.name}"? O usuário perderá acesso ao sistema e suas sessões serão encerradas.`}
        confirmLabel="Desativar"
        loading={deactivateUser.isPending}
        onConfirm={async () => {
          if (userToDeactivate) {
            await deactivateUser.mutateAsync(userToDeactivate.id);
            setUserToDeactivate(null);
          }
        }}
        onClose={() => setUserToDeactivate(null)}
      />

      {/* Temp password dialog */}
      <Dialog
        open={Boolean(tempPassword)}
        onClose={() => setTempPassword(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          Senha temporária gerada
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', mb: 2 }}>
            Compartilhe a senha abaixo com <strong>{tempPassword?.name}</strong>. O usuário
            deverá alterá-la no próximo acesso.
          </DialogContentText>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'background.default',
              border: '1px dashed',
              borderColor: 'secondary.light',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'secondary.dark',
                letterSpacing: '0.1em',
              }}
            >
              {tempPassword?.password}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              if (tempPassword) void navigator.clipboard.writeText(tempPassword.password);
            }}
            startIcon={<Icon name="content_copy" size={16} />}
            sx={{ color: 'secondary.main', textTransform: 'none', fontWeight: 700 }}
          >
            Copiar
          </Button>
          <Button
            onClick={() => setTempPassword(null)}
            variant="contained"
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Escala edit dialog */}
      {escalaUser && (
        <EscalaFormDialog
          open={Boolean(escalaUser)}
          userId={escalaUser.id}
          userName={escalaUser.name}
          onClose={() => setEscalaUser(null)}
        />
      )}
    </Box>
  );
};

export default AdminUsersPage;
