import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, title, message, confirmLabel = 'Excluir', loading, onConfirm, onClose,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: 'text.secondary' }}>{message}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} disabled={loading} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 700 }}>
        Cancelar
      </Button>
      <Button
        onClick={onConfirm}
        disabled={loading}
        variant="contained"
        sx={{ bgcolor: 'error.main', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: 'error.dark' } }}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
