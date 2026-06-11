import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useTrilhas } from '../hooks/useContent';
import { useMinimumLoadingTime } from '../hooks/useMinimumLoadingTime';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LastCourse {
  id: string;
  title: string;
  trilhaTitle: string;
  path: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const LAST_COURSE_KEY = 'interpao_last_course';

export function saveLastCourse(data: LastCourse): void {
  try {
    localStorage.setItem(LAST_COURSE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — ignore
  }
}

function loadLastCourse(): LastCourse | null {
  try {
    const raw = localStorage.getItem(LAST_COURSE_KEY);
    return raw ? (JSON.parse(raw) as LastCourse) : null;
  } catch {
    return null;
  }
}

// ─── Icon helper ──────────────────────────────────────────────────────────────

const Icon: React.FC<{ name: string; size?: number; style?: React.CSSProperties }> = ({
  name, size = 24, style,
}) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, ...style }}>{name}</span>
);

// ─── Feature card ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: string;
  label: string;
  description: string;
  path: string;
  accent?: string;
  adminOnly?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps & { onClick: () => void }> = ({
  icon, label, description, accent, onClick,
}) => {
  const theme = useTheme();
  const color = accent ?? theme.palette.primary.main;

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.14)}`,
          borderColor: alpha(color, 0.35),
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          bgcolor: alpha(color, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={22} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '0.925rem',
            color: 'primary.main',
            fontFamily: '"Manrope", sans-serif',
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55, fontSize: '0.8rem' }}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ mt: 'auto', pt: 0.5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: color,
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Acessar
          <Icon name="arrow_forward" size={14} />
        </Box>
      </Box>
    </Paper>
  );
};

// ─── Resume learning card ─────────────────────────────────────────────────────

const ResumeCard: React.FC<{ course: LastCourse; onContinue: () => void }> = ({
  course, onContinue,
}) => (
  <Paper
    elevation={0}
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
    }}
  >
    {/* Accent stripe */}
    <Box
      sx={{
        width: { sm: 8 },
        height: { xs: 8, sm: 'auto' },
        bgcolor: 'secondary.main',
        flexShrink: 0,
      }}
    />

    <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
      {/* Icon */}
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '14px',
          bgcolor: alpha('#7f5600', 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name="school" size={26} style={{ color: '#7f5600' }} />
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'secondary.main',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            mb: 0.25,
          }}
        >
          {course.trilhaTitle}
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: '1rem',
            color: 'primary.main',
            fontFamily: '"Manrope", sans-serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {course.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          Continue de onde parou
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onContinue}
        startIcon={<Icon name="play_arrow" size={18} />}
        sx={{
          bgcolor: 'primary.main',
          textTransform: 'none',
          fontWeight: 800,
          borderRadius: '12px',
          px: 3,
          flexShrink: 0,
          alignSelf: { xs: 'flex-start', sm: 'center' },
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Continuar
      </Button>
    </Box>
  </Paper>
);

// ─── CTA card when no course history ─────────────────────────────────────────

const StartLearningCard: React.FC<{ onClick: () => void; hasAnyTrilha: boolean }> = ({
  onClick, hasAnyTrilha,
}) => (
  <Paper
    elevation={0}
    sx={{
      border: '1px dashed',
      borderColor: alpha('#7f5600', 0.35),
      borderRadius: '16px',
      p: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { sm: 'center' },
      gap: 2,
      bgcolor: alpha('#7f5600', 0.03),
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: '14px',
        bgcolor: alpha('#7f5600', 0.1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon name="rocket_launch" size={26} style={{ color: '#7f5600' }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontWeight: 800, color: 'primary.main', fontFamily: '"Manrope", sans-serif' }}>
        {hasAnyTrilha ? 'Comece sua jornada de aprendizado' : 'Nenhum conteúdo disponível ainda'}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
        {hasAnyTrilha
          ? 'Explore as trilhas de conhecimento e evolua sua carreira.'
          : 'Aguarde o administrador publicar conteúdos.'}
      </Typography>
    </Box>
    {hasAnyTrilha && (
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{
          borderColor: 'secondary.main',
          color: 'secondary.main',
          textTransform: 'none',
          fontWeight: 800,
          borderRadius: '12px',
          flexShrink: 0,
          alignSelf: { xs: 'flex-start', sm: 'center' },
          '&:hover': { bgcolor: alpha('#7f5600', 0.06), borderColor: 'secondary.dark' },
        }}
      >
        Ver Trilhas
      </Button>
    )}
  </Paper>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: trilhasData, isLoading: trilhasLoading } = useTrilhas();
  const showSkeleton = useMinimumLoadingTime(userLoading, 200);

  const [lastCourse, setLastCourse] = useState<LastCourse | null>(null);

  useEffect(() => {
    setLastCourse(loadLastCourse());
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Colaborador';
  const trilhas = trilhasData ?? [];

  const allFeatures: FeatureCardProps[] = [
    {
      icon: 'route',
      label: 'Trilha do Conhecimento',
      description: 'Acesse módulos, cursos e materiais de desenvolvimento profissional.',
      path: '/trilha',
      accent: '#7f5600',
    },
    {
      icon: 'straighten',
      label: 'Minha Escala',
      description: 'Consulte seus horários de entrada, saída e folgas da semana.',
      path: '/escala',
      accent: '#442a22',
    },
    {
      icon: 'menu_book',
      label: 'Receitas',
      description: 'Explore o acervo de receitas e técnicas do Inter Pão.',
      path: '/receita',
      accent: '#5d4037',
    },
    {
      icon: 'workspace_premium',
      label: 'Benefícios',
      description: 'Veja os benefícios disponíveis para colaboradores da empresa.',
      path: '/beneficios',
      accent: '#6d4a00',
    },
    ...(user?.is_admin
      ? [
          {
            icon: 'edit_note',
            label: 'Gestão de Conteúdo',
            description: 'Publique e edite trilhas, módulos e materiais de aprendizado.',
            path: '/admin/conteudo',
            accent: '#442a22',
            adminOnly: true,
          },
          {
            icon: 'manage_accounts',
            label: 'Gestão de Usuários',
            description: 'Cadastre colaboradores, gerencie acessos e configure escalas.',
            path: '/admin/usuarios',
            accent: '#442a22',
            adminOnly: true,
          },
        ]
      : []),
  ];

  if (showSkeleton) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={280} height={52} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width={180} height={24} sx={{ borderRadius: 1, mt: 0.5 }} />
        </Box>
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px', mb: 4 }} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* ── Greeting ────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            fontFamily: '"Manrope", sans-serif',
            mb: 0.5,
          }}
        >
          Olá, {firstName}!
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {user?.setor?.nome && (
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {user.setor.nome}
            </Typography>
          )}
          {user?.setor?.nome && user?.cargo && (
            <Box sx={{ width: 4, height: 4, bgcolor: 'secondary.main', borderRadius: '50%', opacity: 0.5 }} />
          )}
          {user?.cargo && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {user.cargo}
            </Typography>
          )}
          {user?.is_admin && (
            <Chip
              label="Admin"
              size="small"
              sx={{
                height: 20,
                fontSize: '0.6rem',
                fontWeight: 800,
                bgcolor: alpha('#7f5600', 0.12),
                color: 'secondary.dark',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            />
          )}
        </Box>
      </Box>

      {/* ── Resume learning ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'text.secondary',
            display: 'block',
            mb: 1.5,
          }}
        >
          Continuar aprendendo
        </Typography>

        {trilhasLoading ? (
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: '16px' }} />
        ) : lastCourse ? (
          <ResumeCard
            course={lastCourse}
            onContinue={() => navigate(lastCourse.path)}
          />
        ) : (
          <StartLearningCard
            onClick={() => navigate('/trilha')}
            hasAnyTrilha={trilhas.length > 0}
          />
        )}
      </Box>

      {/* ── Quick access grid ────────────────────────────────────────────────── */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'text.secondary',
            display: 'block',
            mb: 1.5,
          }}
        >
          Acesso rápido
        </Typography>

        <Grid container spacing={2}>
          {allFeatures.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.path}>
              <FeatureCard
                {...feature}
                onClick={() => navigate(feature.path)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
