import React, { useMemo, useState } from 'react';
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
import { useTrilhas, useProgresso } from '../hooks/useContent';
import type { TrilhaSummary } from '../types';
import KnowledgeTrailSkeleton from '../components/skeletons/KnowledgeTrailSkeleton';
import SkeletonTransition from '../components/skeletons/SkeletonTransition';
import { useCurrentUser } from '../hooks/useCurrentUser';

const DEFAULT_COVER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuARrNMPtsQ4KecP43RyGpuu0qpIiCfc0KGVJUrXhpDgVtR6qmlj-z8n91NoxcUztnQdYOV1oBlhV2O4hSJdkQKQ-6v4pfZkzRPV-rOYl9oAn3xnLzFgDddsY1e5RIYAfWAMd9yQVaqj8Gt6FdZuEdmOL_S8apgEqy1cCNtldiLWfxFPfBrB67n-9RSMujriBbvBqxaG4U2BzgOZ6uAfzsvUsfrT-MpO7vA3ajA3s_zTjloxxkHhs--aUlINSdNOJsWy8FCeWkc2Cjk';
const ACCENT_COLORS = ['#7f5600', '#442a22', '#5d4037', '#6d4a00', '#ffb632'];
const FOOTER_HEIGHT = 80;
const ALL_FILTER = 'VER TUDO';

interface ModuleCardProps {
  title: string;
  description: string;
  category: string;
  time: string;
  image: string;
  color: string;
  isLocked: boolean;
  isCert?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title, description, category, time, image, color, isLocked, isCert, isCompleted, onClick,
}) => {
  const theme = useTheme();
  return (
    <Card
      onClick={!isLocked ? onClick : undefined}
      sx={{
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
      <Box sx={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
        {isCompleted && !isLocked && !isCert && (
          <Box
            sx={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              bgcolor: '#4caf50', color: 'white',
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1, py: 0.5, borderRadius: '6px',
              fontWeight: 800, fontSize: '10px',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
            CONCLUÍDA
          </Box>
        )}

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
            {category && (
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
            )}
          </>
        )}
      </Box>

      <CardContent
        sx={{
          height: 136,
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          '&:last-child': { pb: '20px' },
        }}
      >
        <Typography
          noWrap
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            lineHeight: '24px',
            color: isLocked ? 'rgba(26,28,28,0.5)' : (isCert ? color : 'primary.main'),
            mb: '6px',
          }}
        >
          {title}
        </Typography>

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
                {time && (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: theme.palette.secondary.main }}>
                      schedule
                    </span>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '10px' }}>
                      {time}
                    </Typography>
                  </>
                )}
              </Box>
              <Button
                size="small"
                endIcon={<span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>}
                sx={{
                  p: 0, minWidth: 'auto', textTransform: 'none',
                  color: isCert ? color : (isCompleted ? '#4caf50' : 'primary.main'),
                  fontWeight: 700, fontSize: '0.75rem',
                  '&:hover': { bgcolor: 'transparent' },
                }}
              >
                {isCert ? 'Emitir' : (isCompleted ? 'Revisar' : 'Ver')}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const trilhaCategory = (t: TrilhaSummary) => (t.setor?.nome ?? 'GERAL').toUpperCase();

const trilhaTime = (t: TrilhaSummary) => {
  if (t.carga_hor) return `${t.carga_hor} H`;
  return `${t.module_count} ${t.module_count === 1 ? 'MÓDULO' : 'MÓDULOS'}`;
};

const KnowledgeTrailPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  const { data: currentUser } = useCurrentUser();
  const { data: trilhas, isLoading, isError } = useTrilhas();
  const { data: progressoInfo } = useProgresso(); 
  
  const showSkeleton = useMinimumLoadingTime(isLoading, 200);

  const baseTrilhas = useMemo(() => {
    if (!trilhas) return [];
    
    // Leitura segura do usuário contornando o NoInfer do React Query
    const user = currentUser as any;
    const userSetorNome = user?.setor?.nome?.toLowerCase();
    
    // Abrange as variações de role ou is_admin
    const isUserAdmin = userSetorNome === 'administrativo' || user?.role === 'admin' || user?.is_admin === true;
    
    if (isUserAdmin) return trilhas;

    return trilhas.filter((t) => {
      const trilhaSetorNome = t.setor?.nome?.toLowerCase() ?? 'geral';
      if (trilhaSetorNome === 'administrativo' || trilhaSetorNome === 'escritorio') return false;
      if (trilhaSetorNome === 'geral') return true;
      if (userSetorNome && trilhaSetorNome === userSetorNome) return true;
      return false;
    });
  }, [trilhas, currentUser]);

  const filters = useMemo(() => {
    const categories = new Set<string>();
    baseTrilhas.forEach((t) => categories.add(trilhaCategory(t)));
    return [ALL_FILTER, ...Array.from(categories).sort()];
  }, [baseTrilhas]);

  const filteredTrilhas = useMemo(() => {
    if (activeFilter === ALL_FILTER) return baseTrilhas;
    return baseTrilhas.filter((t) => trilhaCategory(t) === activeFilter);
  }, [baseTrilhas, activeFilter]);

  const totalTrilhas = baseTrilhas.length;
  const completedTrilhas = baseTrilhas.filter(t => progressoInfo?.trilhas.includes(t.id_trilha)).length; 
  const progressPct = totalTrilhas ? Math.round((completedTrilhas / totalTrilhas) * 100) : 0;

  return (
    <SkeletonTransition showSkeleton={showSkeleton} skeleton={<KnowledgeTrailSkeleton />}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        <Box sx={{ flex: 1, overflowY: 'auto', pt: 3, pb: `${FOOTER_HEIGHT + 24}px` }}>
          <Box sx={{ px: { xs: 2, md: 4 } }}>

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
                    key={f}
                    size="small"
                    onClick={() => setActiveFilter(f)}
                    sx={{
                      bgcolor: activeFilter === f ? 'white' : 'transparent',
                      color: activeFilter === f ? 'secondary.main' : 'text.secondary',
                      boxShadow: activeFilter === f ? '0px 1px 2px rgba(0,0,0,0.05)' : 'none',
                      '&:hover': { bgcolor: activeFilter === f ? 'white' : 'rgba(255,255,255,0.5)' },
                      px: { xs: 2, md: 3 },
                      fontSize: '0.75rem',
                      fontWeight: activeFilter === f ? 800 : 600,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {f === ALL_FILTER ? 'Ver Tudo' : f}
                  </Button>
                ))}
              </Box>
            </Paper>

            {isError && (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(186,26,26,0.2)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#ba1a1a', opacity: 0.6 }}>
                  error
                </span>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
                  Não foi possível carregar as trilhas
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Verifique sua conexão e tente novamente.
                </Typography>
              </Paper>
            )}

            {!isError && totalTrilhas === 0 && (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px dashed rgba(212,195,190,0.6)', bgcolor: 'transparent' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#7f5600', opacity: 0.4 }}>
                  route
                </span>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mt: 1 }}>
                  Nenhuma trilha disponível ainda
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Assim que um administrador publicar conteúdo, ele aparecerá aqui.
                </Typography>
              </Paper>
            )}

            {totalTrilhas > 0 && (
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
                {filteredTrilhas.map((t, i) => (
                  <ModuleCard
                    key={t.id_trilha}
                    title={t.titulo}
                    description={t.descricao ?? 'Trilha de aprendizado da Inter Pão.'}
                    category={trilhaCategory(t)}
                    time={trilhaTime(t)}
                    image={DEFAULT_COVER}
                    color={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                    isLocked={false}
                    isCompleted={progressoInfo?.trilhas.includes(t.id_trilha) ?? false}
                    onClick={() => navigate(`/curso/${t.id_trilha}`)}
                  />
                ))}

                {activeFilter === ALL_FILTER && (
                  <ModuleCard
                    title="Certificação Final"
                    description={progressPct === 100 ? "Seu certificado está liberado! Clique para emitir." : "Complete todos os conteúdos para obter seu certificado."}
                    category="CONQUISTA"
                    time=""
                    image={DEFAULT_COVER}
                    color={progressPct === 100 ? "#4caf50" : ""}
                    isLocked={progressPct < 100}
                    isCert
                    onClick={() => navigate('/certificado')}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: FOOTER_HEIGHT,
            px: { xs: 2, md: 4 },
            display: 'flex', alignItems: 'center',
            gap: { xs: 3, md: 5 },
            bgcolor: progressPct === 100 ? '#4caf50' : '#ffffff', 
            borderTop: '1px solid rgba(212,195,190,0.4)',
            borderRadius: 0,
            zIndex: 10,
            transition: 'background-color 0.3s ease',
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: progressPct === 100 ? 'rgba(255,255,255,0.8)' : 'text.secondary', opacity: progressPct === 100 ? 1 : 0.6, letterSpacing: '0.08em', display: 'block', mb: 0.25, fontSize: '10px' }}>
              TRILHAS CONCLUÍDAS
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: progressPct === 100 ? '#ffffff' : 'primary.main', lineHeight: 1 }}>
              {completedTrilhas} / {totalTrilhas}
            </Typography>
          </Box>

          <Box sx={{ width: 1, height: 36, bgcolor: progressPct === 100 ? 'rgba(255,255,255,0.3)' : 'rgba(212,195,190,0.5)', flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: progressPct === 100 ? 'rgba(255,255,255,0.8)' : 'text.secondary', opacity: progressPct === 100 ? 1 : 0.6, letterSpacing: '0.08em', fontSize: '10px' }}>
                PROGRESSO GERAL
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, color: progressPct === 100 ? '#ffffff' : 'secondary.main', fontSize: '10px' }}>
                {progressPct}% COMPLETO
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPct || 5}
              sx={{
                height: 8, borderRadius: 4, 
                bgcolor: progressPct === 100 ? 'rgba(255,255,255,0.2)' : '#e3e2e1',
                '& .MuiLinearProgress-bar': { 
                  bgcolor: progressPct === 100 ? '#ffffff' : 'secondary.main', 
                  borderRadius: 4 
                },
              }}
            />
          </Box>

          <Button
            variant={progressPct === 100 ? "outlined" : "contained"}
            size="small"
            endIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>}
            sx={{
              flexShrink: 0, display: { xs: 'none', md: 'flex' },
              bgcolor: progressPct === 100 ? 'transparent' : 'primary.main', 
              color: progressPct === 100 ? 'white' : 'white',
              borderColor: progressPct === 100 ? 'white' : 'transparent',
              fontWeight: 800, fontSize: '0.75rem',
              borderRadius: '10px', px: 2.5,
              textTransform: 'none', boxShadow: 'none',
              '&:hover': { 
                boxShadow: 'none', 
                opacity: 0.9,
                bgcolor: progressPct === 100 ? 'rgba(255,255,255,0.1)' : 'primary.dark'
              },
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