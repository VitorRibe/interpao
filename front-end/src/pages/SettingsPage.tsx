import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { authApi } from '../api/auth';

const Icon: React.FC<{ name: string; size?: number }> = ({ name, size = 20 }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size }}>{name}</span>
);

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const SettingsPage: React.FC = () => {
  const { data: user, isLoading } = useCurrentUser();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const changePassword = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormError(null);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.detail || 'Não foi possível alterar a senha.');
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setFormError('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    changePassword.mutate({ current_password: currentPassword, new_password: newPassword });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Configurações
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gerencie as informações e a segurança da sua conta.
        </Typography>
      </Box>

      {/* Profile card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', mb: 2 }}
        >
          Perfil
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 700,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {user ? getInitials(user.name) : ''}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1rem' }}>
                {user?.name}
              </Typography>
              {user?.is_admin && (
                <Chip
                  label="Administrador"
                  size="small"
                  icon={<Icon name="shield_person" size={14} />}
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: 'rgba(127, 86, 0, 0.12)',
                    color: 'secondary.dark',
                    '& .MuiChip-icon': { color: 'secondary.dark' },
                  }}
                />
              )}
              {user?.is_superuser && (
                <Chip
                  label="Superusuário"
                  size="small"
                  icon={<Icon name="star" size={14} />}
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: 'rgba(68, 42, 34, 0.1)',
                    color: 'primary.main',
                    '& .MuiChip-icon': { color: 'primary.main' },
                  }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cargo
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.25 }}>
              {user?.cargo ?? '—'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Setor
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.25 }}>
              {user?.setor?.nome ?? '—'}
            </Typography>
          </Box>
          {user?.phone && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Telefone
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.25 }}>
                {user.phone}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Change password card */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', mb: 2 }}
        >
          Segurança
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
          Altere sua senha de acesso ao sistema.
        </Typography>

        <form onSubmit={handlePasswordSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formError && (
              <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" sx={{ borderRadius: 2 }} onClose={() => setSuccessMsg(null)}>
                {successMsg}
              </Alert>
            )}

            <TextField
              label="Senha atual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />

            <TextField
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              helperText="Mínimo de 6 caracteres"
            />

            <TextField
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              error={confirmPassword.length > 0 && confirmPassword !== newPassword}
              helperText={
                confirmPassword.length > 0 && confirmPassword !== newPassword
                  ? 'As senhas não coincidem'
                  : undefined
              }
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  changePassword.isPending ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                startIcon={
                  changePassword.isPending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Icon name="lock" size={16} />
                  )
                }
                sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
              >
                {changePassword.isPending ? 'Salvando…' : 'Alterar senha'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
