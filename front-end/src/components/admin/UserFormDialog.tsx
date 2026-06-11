import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material';
import { useCreateUser, useUpdateUser, useAdminSetores } from '../../hooks/useUsers';
import type { AdminUser } from '../../types';

interface UserFormDialogProps {
  open: boolean;
  user?: AdminUser | null;
  onClose: () => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ open, user, onClose }) => {
  const isEdit = Boolean(user);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { data: setores = [] } = useAdminSetores();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cargo, setCargo] = useState('');
  const [idSetor, setIdSetor] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(user?.name ?? '');
      setEmail(user?.email ?? '');
      setPassword('');
      setPhone(user?.phone ?? '');
      setCargo(user?.cargo ?? '');
      setIdSetor(user?.setor?.id_setor ?? '');
      setIsActive(user?.is_active ?? true);
      setError(null);
    }
  }, [open, user]);

  const loading = createUser.isPending || updateUser.isPending;
  const canSubmit = name.trim() && email.trim() && idSetor && (!isEdit ? Boolean(password) : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isEdit && user) {
        await updateUser.mutateAsync({
          id: user.id,
          data: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            cargo: cargo.trim() || null,
            id_setor: idSetor,
            is_active: isActive,
          },
        });
      } else {
        await createUser.mutateAsync({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || null,
          cargo: cargo.trim() || null,
          id_setor: idSetor,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar o usuário.');
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isEdit ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            {!isEdit && (
              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
              <TextField
                label="Cargo"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              select
              label="Setor"
              value={idSetor}
              onChange={(e) => setIdSetor(e.target.value)}
              required
              fullWidth
              helperText={setores.length === 0 ? 'Nenhum setor disponível' : undefined}
            >
              {setores.map((s) => (
                <MenuItem key={s.id_setor} value={s.id_setor}>
                  {s.nome}
                </MenuItem>
              ))}
            </TextField>

            {isEdit && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Usuário ativo"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !canSubmit}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEdit ? (
              'Salvar'
            ) : (
              'Criar'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;
