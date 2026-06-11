import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { useMyEscala } from '../hooks/useEscala';
import type { EscalaItem } from '../types';

// ─── Constants ─────────────────────────────────────────────────────────────────

const DAYS_PT = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({
  name, size = 20, style,
}) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getMondayOfWeek(offset: number): Date {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekDates(offset: number): Date[] {
  const monday = getMondayOfWeek(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatInterval(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function weekLabel(dates: Date[]): string {
  const start = dates[0];
  const end = dates[6];
  if (start.getMonth() === end.getMonth()) {
    return `${MONTHS_PT[start.getMonth()]} ${start.getFullYear()}`;
  }
  return `${MONTHS_PT[start.getMonth()]} – ${MONTHS_PT[end.getMonth()]} ${end.getFullYear()}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const TimeBlock: React.FC<{ label: string; value: string; icon: string }> = ({
  label, value, icon,
}) => (
  <Box>
    <Typography
      sx={{
        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'text.secondary', mb: 0.5,
      }}
    >
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Icon name={icon} size={18} style={{ color: '#7f5600' }} />
      <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'primary.main' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const TurnoChip: React.FC<{ turno: string }> = ({ turno }) => {
  const isNight = turno.toLowerCase().includes('noite') || turno.toLowerCase().includes('tarde');
  return (
    <Chip
      label={turno}
      size="small"
      sx={{
        height: 24,
        fontSize: '0.65rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderRadius: '999px',
        bgcolor: isNight ? alpha('#442a22', 0.12) : alpha('#7f5600', 0.15),
        color: isNight ? 'primary.main' : 'secondary.dark',
      }}
    />
  );
};

// ─── Day Card ──────────────────────────────────────────────────────────────────

const DayCard: React.FC<{ item: EscalaItem | undefined; date: Date; dayIndex: number }> = ({
  item, date, dayIndex,
}) => {
  const theme = useTheme();
  const isFolga = !item || item.folga;

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: isFolga ? 'divider' : 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        opacity: isFolga ? 0.6 : 1,
        filter: isFolga ? 'grayscale(0.4)' : 'none',
        transition: 'box-shadow 0.2s',
        '&:hover': isFolga
          ? {}
          : { boxShadow: '0 4px 16px rgba(68,42,34,0.1)', border: '1px solid', borderColor: 'divider' },
      }}
    >
      {/* Left: date panel */}
      <Box
        sx={{
          width: { md: 192 },
          bgcolor: isFolga
            ? alpha(theme.palette.text.secondary, 0.04)
            : alpha(theme.palette.primary.main, 0.05),
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: { md: '1px solid' },
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'divider',
          minHeight: { xs: 'auto', md: 120 },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.6rem', fontWeight: 900, color: 'secondary.main',
            textTransform: 'uppercase', letterSpacing: '0.2em', mb: 0.5,
          }}
        >
          {DAYS_PT[dayIndex]}
        </Typography>
        <Typography
          sx={{
            fontSize: '2.5rem', fontWeight: 800, color: 'primary.main',
            lineHeight: 1, fontFamily: '"Manrope", sans-serif',
          }}
        >
          {date.getDate()}
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
          {MONTHS_PT[date.getMonth()]}
        </Typography>
      </Box>

      {/* Right: content */}
      <Box sx={{ p: 3, flex: 1, display: 'flex', alignItems: 'center' }}>
        {isFolga ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <Icon name="event_busy" size={22} />
            <Typography sx={{ fontWeight: 600, fontStyle: 'italic', color: 'text.secondary' }}>
              Folga Semanal
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* Times row */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
                <TimeBlock label="Entrada" value={item!.entrada ?? '—'} icon="schedule" />
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <TimeBlock label="Saída" value={item!.saida ?? '—'} icon="logout" />
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.12em', color: 'text.secondary', mb: 0.5,
                    }}
                  >
                    Intervalo
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'secondary.main' }}>
                    {formatInterval(item!.intervalo_min)}
                  </Typography>
                </Box>
              </Box>

              {item!.turno && <TurnoChip turno={item!.turno} />}
            </Box>

            {/* Notes */}
            {item!.notas && (
              <Box
                sx={{
                  mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider',
                  bgcolor: 'background.default', borderRadius: 2, p: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'text.secondary',
                    display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5,
                  }}
                >
                  <Icon name="sticky_note" size={14} /> Notas Importantes
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6 }}>
                  {item!.notas}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const EscalaPage: React.FC = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const { data, isLoading, isError } = useMyEscala();

  const dates = getWeekDates(weekOffset);
  const itemsByDay = Object.fromEntries(
    (data?.itens ?? []).map((item) => [item.dia_semana, item])
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Section header */}
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
            Minha Programação
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'secondary.main', fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.1em', display: 'block', mt: 0.25,
            }}
          >
            {weekLabel(dates)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Week navigation */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => setWeekOffset((o) => o - 1)}
            sx={{
              minWidth: 36, px: 1, borderColor: 'divider',
              color: 'primary.main', textTransform: 'none', fontWeight: 700,
            }}
          >
            <Icon name="chevron_left" size={18} />
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset(0)}
            sx={{
              borderColor: 'divider', color: 'primary.main',
              textTransform: 'none', fontWeight: 700, fontSize: '0.75rem',
            }}
          >
            Semana Atual
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setWeekOffset((o) => o + 1)}
            sx={{
              minWidth: 36, px: 1, borderColor: 'divider',
              color: 'primary.main', textTransform: 'none', fontWeight: 700,
            }}
          >
            <Icon name="chevron_right" size={18} />
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={() => window.print()}
            startIcon={<Icon name="print" size={16} />}
            sx={{
              bgcolor: 'primary.main', textTransform: 'none',
              fontWeight: 700, ml: 0.5,
            }}
          >
            Imprimir
          </Button>
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
            Não foi possível carregar a escala
          </Typography>
        </Paper>
      )}

      {!isLoading && !isError && (
        <>
          {!data || data.itens.length === 0 ? (
            <Paper
              sx={{
                p: 6, textAlign: 'center',
                border: '1px dashed rgba(212,195,190,0.6)',
              }}
            >
              <Icon name="calendar_month" size={44} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
                Nenhuma escala cadastrada
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Aguarde seu administrador configurar a escala.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dates.map((date, i) => (
                <DayCard
                  key={i}
                  item={itemsByDay[i]}
                  date={date}
                  dayIndex={i}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EscalaPage;
