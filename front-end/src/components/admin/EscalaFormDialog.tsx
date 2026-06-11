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
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useUserEscala, useUpsertEscala } from '../../hooks/useEscala';
import type { EscalaItem } from '../../types';

// ─── Constants ─────────────────────────────────────────────────────────────────

const DAYS_PT = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const TURNO_OPTIONS = [
  'Turno Manhã',
  'Turno Tarde',
  'Turno Noite',
  'Turno Tarde/Noite',
  'Turno Integral',
];

const DEFAULT_ITEM = (dia: number): EscalaItem => ({
  dia_semana: dia,
  folga: false,
  entrada: '08:00',
  saida: '16:20',
  intervalo_min: 60,
  turno: 'Turno Manhã',
  notas: null,
});

// ─── Component ─────────────────────────────────────────────────────────────────

interface EscalaFormDialogProps {
  open: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
}

const EscalaFormDialog: React.FC<EscalaFormDialogProps> = ({
  open, userId, userName, onClose,
}) => {
  const { data: existing, isLoading: loadingEscala } = useUserEscala(open ? userId : null);
  const upsert = useUpsertEscala(userId);

  const [itens, setItens] = useState<EscalaItem[]>(() =>
    Array.from({ length: 7 }, (_, i) => DEFAULT_ITEM(i))
  );
  const [error, setError] = useState<string | null>(null);

  // Initialise form when dialog opens and data arrives
  useEffect(() => {
    if (!open) return;
    const map: Record<number, EscalaItem> = {};
    (existing?.itens ?? []).forEach((item) => { map[item.dia_semana] = item; });
    setItens(
      Array.from({ length: 7 }, (_, i) =>
        map[i] ?? DEFAULT_ITEM(i)
      )
    );
    setError(null);
  }, [open, existing]);

  const update = (dia: number, patch: Partial<EscalaItem>) => {
    setItens((prev) =>
      prev.map((item) => (item.dia_semana === dia ? { ...item, ...patch } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await upsert.mutateAsync({ itens });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Não foi possível salvar a escala.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={upsert.isPending ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main' }}>
          Escala de {userName}
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {loadingEscala ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: 'secondary.main' }} />
            </Box>
          ) : (
            <Box>
              {error && (
                <Alert severity="error" sx={{ m: 2, borderRadius: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {itens.map((item, idx) => (
                <React.Fragment key={item.dia_semana}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Day label */}
                    <Box sx={{ width: 80, pt: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.875rem' }}>
                        {DAYS_PT[item.dia_semana]}
                      </Typography>
                    </Box>

                    {/* Folga toggle */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item.folga}
                          onChange={(e) => update(item.dia_semana, { folga: e.target.checked })}
                          size="small"
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Folga
                        </Typography>
                      }
                      sx={{ mr: 0, mt: 0.5 }}
                    />

                    {/* Schedule fields (hidden when folga) */}
                    {!item.folga && (
                      <>
                        <TextField
                          type="time"
                          label="Entrada"
                          size="small"
                          value={item.entrada ?? ''}
                          onChange={(e) => update(item.dia_semana, { entrada: e.target.value })}
                          sx={{ width: 120 }}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          type="time"
                          label="Saída"
                          size="small"
                          value={item.saida ?? ''}
                          onChange={(e) => update(item.dia_semana, { saida: e.target.value })}
                          sx={{ width: 120 }}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          type="number"
                          label="Intervalo (min)"
                          size="small"
                          value={item.intervalo_min}
                          onChange={(e) =>
                            update(item.dia_semana, { intervalo_min: Math.max(0, Number(e.target.value)) })
                          }
                          inputProps={{ min: 0, max: 480 }}
                          sx={{ width: 130 }}
                        />
                        <TextField
                          select
                          label="Turno"
                          size="small"
                          value={item.turno ?? ''}
                          onChange={(e) => update(item.dia_semana, { turno: e.target.value })}
                          sx={{ width: 170 }}
                        >
                          {TURNO_OPTIONS.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          label="Notas"
                          size="small"
                          value={item.notas ?? ''}
                          onChange={(e) =>
                            update(item.dia_semana, { notas: e.target.value || null })
                          }
                          multiline
                          maxRows={2}
                          sx={{ flex: 1, minWidth: 200 }}
                          placeholder="Observações para este dia…"
                        />
                      </>
                    )}
                  </Box>
                  {idx < 6 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={upsert.isPending}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={upsert.isPending || loadingEscala}
            sx={{ bgcolor: 'primary.main', textTransform: 'none', fontWeight: 700 }}
          >
            {upsert.isPending ? <CircularProgress size={20} color="inherit" /> : 'Salvar Escala'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EscalaFormDialog;
