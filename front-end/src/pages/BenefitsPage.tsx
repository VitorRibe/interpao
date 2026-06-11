import React from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BenefitFeature {
  label: string;
}

interface Benefit {
  id: string;
  icon: string;
  category: string;
  title: string;
  subtitle: string;
  status: 'active' | 'available';
  features: BenefitFeature[];
}

// ─── Static data ───────────────────────────────────────────────────────────────

const BENEFITS: Benefit[] = [
  {
    id: 'saude',
    icon: 'medical_services',
    category: 'Saúde',
    title: 'Plano de Saúde',
    subtitle: 'Cobertura Nacional Completa',
    status: 'active',
    features: [
      { label: 'Rede Credenciada Premium' },
      { label: 'Coparticipação Isenta' },
      { label: 'Incluso Dependentes' },
    ],
  },
  {
    id: 'bemEstar',
    icon: 'fitness_center',
    category: 'Bem-estar',
    title: 'Gympass Gold',
    subtitle: 'Acesso a academias e apps de saúde',
    status: 'active',
    features: [
      { label: 'Acesso ilimitado a +5000 academias' },
      { label: 'Aulas ao vivo e personal digital' },
    ],
  },
  {
    id: 'alimentacao',
    icon: 'restaurant',
    category: 'Alimentação',
    title: 'Vale Refeição & Alimentação',
    subtitle: 'Cartão Flexível Alelo',
    status: 'active',
    features: [
      { label: 'R$ 850,00 mensal acumulativo' },
      { label: 'Aceito em restaurantes e mercados' },
    ],
  },
  {
    id: 'seguro',
    icon: 'admin_panel_settings',
    category: 'Seguro',
    title: 'Seguro de Vida Individual',
    subtitle: 'Proteção Familiar Completa',
    status: 'available',
    features: [
      { label: 'Cobertura por invalidez ou morte' },
      { label: 'Assistência funeral inclusa' },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({
  name, size = 24, style,
}) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

// ─── Status chip ──────────────────────────────────────────────────────────────

const StatusChip: React.FC<{ status: Benefit['status'] }> = ({ status }) => {
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

// ─── Benefit card ─────────────────────────────────────────────────────────────

const BenefitCard: React.FC<{ benefit: Benefit }> = ({ benefit }) => {
  const theme = useTheme();
  const isAvailableOnly = benefit.status === 'available';

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        opacity: isAvailableOnly ? 0.8 : 1,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Left accent panel */}
      <Box
        sx={{
          width: { md: 192 },
          bgcolor: alpha(theme.palette.primary.main, 0.05),
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
          name={benefit.icon}
          size={40}
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
          {benefit.category}
        </Typography>
      </Box>

      {/* Right content */}
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Header row */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
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
              {benefit.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {benefit.subtitle}
            </Typography>
          </Box>
          <StatusChip status={benefit.status} />
        </Box>

        {/* Features */}
        <Box
          sx={{
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.25,
          }}
        >
          {benefit.features.map((feat) => (
            <Box
              key={feat.label}
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
                {feat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const BenefitsPage: React.FC = () => {
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Seus Benefícios
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
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
            Ver Políticas
          </Button>
          <Button
            variant="contained"
            startIcon={<Icon name="settings_suggest" size={16} />}
            sx={{
              bgcolor: 'primary.main',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: '10px',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Gerenciar
          </Button>
        </Box>
      </Box>

      {/* Benefits list */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {BENEFITS.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </Box>
    </Box>
  );
};

export default BenefitsPage;
