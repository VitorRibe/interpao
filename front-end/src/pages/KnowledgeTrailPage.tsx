import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  LinearProgress,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMinimumLoadingTime } from '../hooks/useMinimumLoadingTime';
import KnowledgeTrailSkeleton from '../components/skeletons/KnowledgeTrailSkeleton';
import SkeletonTransition from '../components/skeletons/SkeletonTransition';

const modules = [
  {
    id: 1,
    title: 'História & Valores',
    description: 'A origem da Inter Pão e nossa missão de entregar qualidade superior.',
    category: 'CULTURA',
    time: '15 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#7f5600',
  },
  {
    id: 2,
    title: 'Domínio da massa',
    description: 'O passo a passo da nossa receita mais amada, do preparo ao forno.',
    category: 'RECEITAS',
    time: '45 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#442a22',
  },
  {
    id: 3,
    title: 'Higiene e Manipulação',
    description: 'Protocolos de segurança alimentar e organização do espaço de trabalho.',
    category: 'PROCESSOS',
    time: '30 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#e3e2e1',
  },
  {
    id: 4,
    title: 'Operação de Fornos',
    description: 'Manual técnico para controle de temperatura e tempos de cocção ideais.',
    category: 'PROCESSOS',
    time: '20 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#ffdad6',
  },
  {
    id: 5,
    title: 'Seleção de Insumos',
    description: 'Conheça os fornecedores e o rigor na escolha de cada matéria-prima.',
    category: 'RECEITAS',
    time: '25 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#5d4037',
  },
  {
    id: 6,
    title: 'Cultura de Excelência',
    description: 'Nosso compromisso com a satisfação do cliente em cada detalhe.',
    category: 'CULTURA',
    time: '20 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#7f5600',
  },
  {
    id: 7,
    title: 'Finalização e Exposição',
    description: 'Como apresentar nossos produtos para encantar os olhos e o paladar.',
    category: 'PROCESSOS',
    time: '15 MIN',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk',
    color: '#e3e2e1',
  },
];

const filters = [
  { label: 'Ver Tudo', value: 'VER TUDO' },
  { label: 'Receitas', value: 'RECEITAS' },
  { label: 'Processos', value: 'PROCESSOS' },
  { label: 'Cultura', value: 'CULTURA' },
];

const FOOTER_HEIGHT = 80;

// ── Shared card component – locked and unlocked have identical DOM structure ──
interface ModuleCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
  color: string;
  isLocked: boolean;
  isCert?: boolean;
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title, description, category, time, image, color, isLocked, isCert, onClick,
}) => {
  const theme = useTheme();
  return (
    <Card
      onClick={!isLocked ? onClick : undefined}
      sx={{
        // The card fills the grid cell entirely – no width tricks needed
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        border: '1px solid rgba(212,195,190,0.3)',
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        bgcolor: isLocked ? '#e9e8e7' : '#ffffff',
        ...(!isLocked && {
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0px 12px 24px rgba(68,42,34,0.1)',
            borderColor: 'rgba(127,86,0,0.3)',
          },
        }),
      }}
    >
      {/* Thumbnail – always 160 px tall */}
      <Box sx={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isLocked ? 'grayscale(100%)' : 'none',
            opacity: isLocked ? 0.3 : 1,
            transition: 'transform 0.5s ease',
            ...(!isLocked && { '&:hover': { transform: 'scale(1.08)' } }),
          }}
        />
        {isLocked ? (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: 'rgba(250,249,248,0.4)', backdropFilter: 'blur(1px)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 40, color: theme.palette.primary.main, opacity: 0.4 }}
            >
              {isCert ? 'workspace_premium' : 'lock'}
            </span>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute', bottom: 12, left: 12,
                bgcolor: color, color: 'white',
                fontWeight: 800, fontSize: '10px',
                px: 1, py: 0.5, borderRadius: '4px',
              }}
            >
              {category}
            </Box>
          </>
        )}
      </Box>

      {/* Body – fixed pixel height so every card is identical */}
      <CardContent
        sx={{
          height: 136,
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          '&:last-child': { pb: '20px' }, // neutralise MUI's own override
        }}
      >
        {/* Title row – 1 line, clipped */}
        <Typography
          noWrap
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            lineHeight: '24px',
            color: isLocked ? 'rgba(26,28,28,0.5)' : 'primary.main',
            mb: '6px',
          }}
        >
          {title}
        </Typography>

        {/* Description – exactly 2 lines */}
        <Typography
          variant="caption"
          sx={{
            color: isLocked ? 'rgba(80,68,65,0.5)' : 'text.secondary',
            lineHeight: '18px',
            height: 36,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {isLocked
            ? 'Complete o conteúdo anterior para desbloquear este módulo.'
            : description}
        </Typography>

        {/* Footer – pinned to bottom via mt:auto */}
        <Box
          sx={{
            mt: 'auto',
            pt: '8px',
            height: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(212,195,190,0.2)',
          }}
        >
          {isLocked ? (
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(80,68,65,0.4)', letterSpacing: '0.1em' }}>
              BLOQUEADO
            </Typography>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: theme.palette.secondary.main }}>
                  schedule
                </span>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '10px' }}>
                  {time}
                </Typography>
              </Box>
              <Button
                size="small"
                endIcon={<span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>}
                sx={{
                  p: 0, minWidth: 'auto', textTransform: 'none',
                  color: 'primary.main', fontWeight: 700, fontSize: '0.75rem',
                  '&:hover': { bgcolor: 'transparent' },
                }}
              >
                Ver
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const KnowledgeTrailPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('VER TUDO');
  
  // Mock loading state for demonstration as this page is currently static
  const [isLoading, setIsLoading] = useState(true);
  const showSkeleton = useMinimumLoadingTime(isLoading, 200);

  // Auto-finish mock loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredModules =
    activeFilter === 'VER TUDO' ? modules : modules.filter((m) => m.category === activeFilter);

  const totalModules = modules.length;
  const completedModules = 0;
  const progressPct = Math.round((completedModules / totalModules) * 100);

  return (
    <SkeletonTransition showSkeleton={showSkeleton} skeleton={<KnowledgeTrailSkeleton />}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: 'auto', pt: 3, pb: `${FOOTER_HEIGHT + 24}px` }}>

          {/*
            One shared px wrapper. Both the header Paper and the CSS grid
            sit inside it, so their outer edges are identical — no offset.
          */}
          <Box sx={{ px: { xs: 2, md: 4 } }}>

            {/* Header */}
            <Paper
              sx={{
                p: 3, mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', lg: 'center' },
                gap: 2,
                bgcolor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(212,195,190,0.3)',
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: '"Manrope", sans-serif' }}>
                  Navegador de Aprendizado
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Personalize sua visão para focar no que é importante agora.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, p: 0.5, bgcolor: '#eeeeed', borderRadius: '12px', flexWrap: 'wrap' }}>
                {filters.map((f) => (
                  <Button
                    key={f.value}
                    size="small"
                    onClick={() => setActiveFilter(f.value)}
                    sx={{
                      bgcolor: activeFilter === f.value ? 'white' : 'transparent',
                      color: activeFilter === f.value ? 'secondary.main' : 'text.secondary',
                      boxShadow: activeFilter === f.value ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                      '&:hover': { bgcolor: activeFilter === f.value ? 'white' : 'rgba(255,255,255,0.5)' },
                      px: { xs: 2, md: 3 },
                      fontSize: '0.75rem',
                      fontWeight: activeFilter === f.value ? 800 : 600,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {f.label}
                  </Button>
                ))}
              </Box>
            </Paper>

            {/*
              Native CSS grid.
              - `display: grid` with `grid-template-columns: repeat(N, 1fr)` is the
                only layout that guarantees all columns are exactly the same width.
              - MUI <Grid container> adds a negative margin equal to half the spacing
                on each side of the container, which makes the grid wider than its
                parent by `spacing` px and causes the first column to appear wider
                when the parent clips the overflow. Using a plain Box with CSS grid
                avoids all of that.
            */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: '24px',
              }}
            >
              {filteredModules.map((m) => (
                <ModuleCard
                  key={m.id}
                  title={m.title}
                  description={m.description}
                  category={m.category}
                  time={m.time}
                  image={m.image}
                  color={m.color}
                  isLocked={m.id > 1}
                  onClick={() => navigate(`/curso/${m.id}`)}
                />
              ))}

              {activeFilter === 'VER TUDO' && (
                <ModuleCard
                  title="Certificação Final"
                  description="Complete todos os conteúdos para obter seu certificado."
                  category=""
                  time=""
                  image={modules[0].image}
                  color=""
                  isLocked
                  isCert
                />
              )}
            </Box>

          </Box>
        </Box>

        {/* Fixed footer */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: FOOTER_HEIGHT,
            px: { xs: 2, md: 4 },
            display: 'flex', alignItems: 'center',
            gap: { xs: 3, md: 5 },
            bgcolor: '#ffffff',
            borderTop: '1px solid rgba(212,195,190,0.4)',
            borderRadius: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', opacity: 0.6, letterSpacing: '0.08em', display: 'block', mb: 0.25, fontSize: '10px' }}>
              MÓDULOS CONCLUÍDOS
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>
              {completedModules} / {totalModules}
            </Typography>
          </Box>

          <Box sx={{ width: 1, height: 36, bgcolor: 'rgba(212,195,190,0.5)', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', opacity: 0.6, letterSpacing: '0.08em', fontSize: '10px' }}>
                PROGRESSO GERAL
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main', fontSize: '10px' }}>
                {progressPct}% COMPLETO
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPct || 5}
              sx={{
                height: 8, borderRadius: 4, bgcolor: '#e3e2e1',
                '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 4 },
              }}
            />
          </Box>

          <Button
            variant="contained"
            size="small"
            endIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>}
            sx={{
              flexShrink: 0, display: { xs: 'none', md: 'flex' },
              bgcolor: 'primary.main', color: 'white',
              fontWeight: 800, fontSize: '0.75rem',
              borderRadius: '10px', px: 2.5,
              textTransform: 'none', boxShadow: 'none',
              '&:hover': { boxShadow: 'none', opacity: 0.9 },
            }}
          >
            Continuar
          </Button>
        </Paper>
      </Box>
    </SkeletonTransition>
  );
};

export default KnowledgeTrailPage;