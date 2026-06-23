import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  LinearProgress,
  CircularProgress,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useSpring, animated } from '@react-spring/web';
import { useTrilha, useConcluirModulo } from '../hooks/useContent';
import { saveLastCourse } from './DashboardPage';
import type { Modulo, Multimidia } from '../types';

// ─── Theme ────────────────────────────────────────────────────────────────────
const courseTheme = createTheme({
  palette: {
    primary: { main: '#2c1a0e', contrastText: '#fff' },
    secondary: { main: '#c9883d', light: '#e8b96d', contrastText: '#fff' },
    background: { default: '#faf6f0', paper: '#f0e8db' },
    text: { primary: '#2c1a0e', secondary: '#7a6a5a' },
    divider: '#e8ddd0',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 900 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', fontSize: '0.6rem', height: 24 },
      },
    },
  },
});

const DEFAULT_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAimTOmjwW-r9XVjb5AVosuHXuUWZigtEnPcZhJAPBIaXhQAjgljOFeKeWk_K3GpfIoGY9qbYD6R364NS2ITY7SN8By3q5HxE7iVutGcFou1071dHPL9lycbGlsBm8YOeF5wnrhJCmdneEoK-37gID0RqVqQCy9K-OY3L1JM4kFicOFA-6Z9fwQppQhU6K19XtEAmuzgdMESzmCVDZ4ZTOpjg0Fj4tgrOncAIxPTbgFdIuEmUkFnYpnNyD7raSkTjN9er_lN1ogJEA';

// ─── Multimídia icon by type ────────────────────────────────────────────────────
const mediaIcon = (tipo: string | null): string => {
  switch ((tipo ?? '').toLowerCase()) {
    case 'video':
    case 'vídeo': return 'play_circle';
    case 'pdf':
    case 'documento': return 'description';
    case 'imagem':
    case 'image': return 'image';
    case 'audio':
    case 'áudio': return 'headphones';
    default: return 'attachment';
  }
};

const MediaCard: React.FC<{ item: Multimidia }> = ({ item }) => (
  <Paper
    elevation={0}
    sx={{
      display: 'flex', alignItems: 'center', gap: 2, p: 2,
      border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3,
    }}
  >
    <Box
      sx={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        bgcolor: 'rgba(201,136,61,0.12)', color: 'secondary.main',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{mediaIcon(item.tipo)}</span>
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: 'primary.main' }}>
        {item.titulo}
      </Typography>
      {item.tipo && (
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {item.tipo}
        </Typography>
      )}
    </Box>
    {item.url && (
      <Button
        size="small"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>}
        sx={{ textTransform: 'none', fontWeight: 700, color: 'secondary.main', flexShrink: 0 }}
      >
        Abrir
      </Button>
    )}
  </Paper>
);

// ─── Chapter body (data-driven módulo) ──────────────────────────────────────────
const ChapterBody: React.FC<{ modulo: Modulo }> = ({ modulo }) => (
  <>
    {modulo.descricao && (
      <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem', fontStyle: 'italic' }}>
        {modulo.descricao}
      </Typography>
    )}
    {modulo.conteudo && (
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
        {modulo.conteudo}
      </Typography>
    )}
    {!modulo.conteudo && !modulo.descricao && (
      <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7, fontStyle: 'italic' }}>
        Conteúdo deste módulo em breve.
      </Typography>
    )}
    {modulo.multimidia.length > 0 && (
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', mb: 1.5 }}>
          Recursos do módulo
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {modulo.multimidia.map((item) => (
            <MediaCard key={item.id_multimidia} item={item} />
          ))}
        </Box>
      </Box>
    )}
  </>
);

// ─── Smooth scroll using rAF + easing ──────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(container: HTMLElement, targetY: number, duration = 700, onDone?: () => void) {
  const startY = container.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = startY + distance * easeInOutCubic(progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  }
  requestAnimationFrame(step);
}

// ─── Animated sidebar nav item ────────────────────────────────────────────────
const NavItem: React.FC<{
  number: string;
  title: string;
  meta: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ number, title, meta, isActive, onClick }) => {
  const spring = useSpring({
    backgroundColor: isActive ? '#f0e8db' : 'rgba(250,246,240,0)',
    borderLeftColor: isActive ? '#c9883d' : 'rgba(201,136,61,0)',
    config: { tension: 300, friction: 30 },
  });
  const numSpring = useSpring({
    opacity: isActive ? 1 : 0.22,
    config: { tension: 300, friction: 30 },
  });

  return (
    <animated.div
      onClick={onClick}
      style={{
        ...spring, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 14px',
        marginBottom: 2, borderRadius: 8, borderLeft: '3px solid', cursor: 'pointer', userSelect: 'none',
      }}
    >
      <animated.span
        style={{
          ...numSpring, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#c9883d',
          fontSize: '0.78rem', minWidth: 20, paddingTop: 2, flexShrink: 0,
        }}
      >
        {number}
      </animated.span>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: isActive ? 800 : 600, lineHeight: 1.3, mb: 0.3, fontSize: '0.8rem' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.52, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.57rem' }}>
          {meta}
        </Typography>
      </Box>
    </animated.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const CourseContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const { data: trilha, isLoading, isError } = useTrilha(id);
  const concluirModuloMutation = useConcluirModulo();

  const modulos = trilha?.modulos ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!activeId && modulos.length > 0) setActiveId(modulos[0].id_modulo);
  }, [modulos, activeId]);

  useEffect(() => {
    if (!trilha || !id) return;
    saveLastCourse({
      id,
      title: trilha.titulo,
      trilhaTitle: trilha.setor?.nome ?? 'Trilha do Conhecimento',
      path: `/curso/${id}`,
    });
  }, [id, trilha]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || modulos.length === 0) return;
    const obs: IntersectionObserver[] = [];
    modulos.forEach(({ id_modulo }) => {
      const el = sectionRefs.current[id_modulo];
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (!isAnimating.current && entry.isIntersecting) setActiveId(id_modulo); },
        { root, rootMargin: '-8% 0px -60% 0px', threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, [modulos]);

  const scrollToChapter = useCallback((moduloId: string) => {
    const container = scrollRef.current;
    const target = sectionRefs.current[moduloId];
    if (!container || !target) return;

    setActiveId(moduloId);
    isAnimating.current = true;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const to = Math.max(0, container.scrollTop + (targetTop - containerTop) - 40);

    smoothScrollTo(container, to, 700, () => { isAnimating.current = false; });
  }, []);

  const activeIndex = Math.max(0, modulos.findIndex((m) => m.id_modulo === activeId));
  const progressPct = modulos.length ? ((activeIndex + 1) / modulos.length) * 100 : 0;

  if (isLoading) {
    return (
      <ThemeProvider theme={courseTheme}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default' }}>
          <CircularProgress sx={{ color: 'secondary.main' }} />
        </Box>
      </ThemeProvider>
    );
  }

  if (isError || !trilha) {
    return (
      <ThemeProvider theme={courseTheme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'background.default', gap: 1, px: 4, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#c9883d' }}>error</span>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>Curso não encontrado</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Esta trilha pode ter sido removida ou o link está incorreto.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={courseTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', m: '0 !important', p: '0 !important' }}>
        
        {/* ── Hero ── */}
        <Box sx={{ position: 'relative', height: { xs: 220, md: 340 }, flexShrink: 0 }}>
          <Box component="img" src={DEFAULT_HERO} alt={trilha.titulo} sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.62) saturate(0.85)', display: 'block' }} />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(44,26,14,0.95) 0%, rgba(44,26,14,0.45) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', px: { xs: 4, md: 6 }, py: { xs: 4, md: 5 } }}>
            <Chip label={trilha.setor?.nome ?? 'Trilha de Conhecimento'} size="small" sx={{ bgcolor: 'secondary.main', color: '#fff', width: 'fit-content', mb: 2, fontWeight: 900, fontSize: '0.58rem', letterSpacing: '0.16em' }} />
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '1.7rem', md: '2.5rem' }, lineHeight: 1.1, mb: 1.5, maxWidth: 520 }}>
              {trilha.titulo}
            </Typography>
            {trilha.descricao && (
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 460, lineHeight: 1.65, fontSize: '0.9rem' }}>
                {trilha.descricao}
              </Typography>
            )}
          </Box>
        </Box>

        {/* ── Progress strip ── */}
        <Box sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', gap: 3, px: { xs: 4, md: 6 }, py: 1.25, flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.13em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontSize: '0.57rem' }}>
            Seu Progresso
          </Typography>
          <LinearProgress variant="determinate" value={progressPct} sx={{ flex: 1, height: 3, borderRadius: 99, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 99, transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' } }} />
          <Typography variant="caption" sx={{ color: 'secondary.light', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
            {modulos.length ? `${activeIndex + 1} de ${modulos.length} capítulos` : 'Sem capítulos'}
          </Typography>
        </Box>

        {/* ── Body row ── */}
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          
          {/* ── Scrollable content column ── */}
          <Box ref={scrollRef} sx={{ flex: 1, minWidth: 0, overflowY: 'scroll', bgcolor: '#ffffff', borderRight: isLargeScreen ? '1px solid' : 'none', borderColor: 'divider', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Box sx={{ px: { xs: 4, md: 6, xl: 10 }, py: { xs: 5, md: 7 } }}>
              {modulos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#c9883d', opacity: 0.5 }}>menu_book</span>
                  <Typography variant="h5" sx={{ color: 'primary.main', mt: 1 }}>Nenhum módulo ainda</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>O conteúdo desta trilha está sendo preparado.</Typography>
                </Box>
              )}

              {modulos.map((modulo, index) => {
                const number = String(modulo.ordem ?? index + 1).padStart(2, '0');
                
                return (
                  <Box
                    key={modulo.id_modulo}
                    ref={(el: HTMLDivElement | null) => { sectionRefs.current[modulo.id_modulo] = el; }}
                    sx={{
                      mb: index < modulos.length - 1 ? 10 : 0,
                      pb: index < modulos.length - 1 ? 10 : 0,
                      borderBottom: index < modulos.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                      <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: '3rem', fontWeight: 900, color: 'secondary.main', opacity: 0.12, lineHeight: 1, userSelect: 'none', minWidth: 52, textAlign: 'right', mt: 0.3, flexShrink: 0 }}>
                        {number}
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h5" sx={{ color: 'primary.main', lineHeight: 1.2, mb: 1.25 }}>
                          {modulo.titulo}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {modulo.duracao != null && (
                            <Chip label={`⏱ ${modulo.duracao} min`} size="small" variant="outlined" sx={{ borderColor: 'secondary.main', color: 'secondary.main', bgcolor: 'rgba(201,136,61,0.05)' }} />
                          )}
                          {modulo.multimidia.length > 0 && (
                            <Chip label={`${modulo.multimidia.length} recursos`} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary', bgcolor: 'background.default' }} />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ pl: { xs: 0, sm: '76px' } }}>
                      <ChapterBody modulo={modulo} />
                      
                      <Box sx={{ mt: 5, pt: 3, borderTop: '1px dashed', borderColor: 'divider', display: 'flex', justifyContent: 'flex-start' }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            concluirModuloMutation.mutate(modulo.id_modulo, {
                              onSuccess: (response) => {
                                if (response?.trilha_concluida) {
                                  alert('Parabéns! Você concluiu todos os módulos desta trilha e seu certificado está liberado!');
                                }
                              }
                            });
                          }}
                          disabled={concluirModuloMutation.isPending}
                          startIcon={
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                              {concluirModuloMutation.isPending ? 'sync' : 'check_circle'}
                            </span>
                          }
                          sx={{
                            bgcolor: 'secondary.main',
                            color: 'white',
                            fontWeight: 800,
                            px: 3,
                            py: 1,
                            borderRadius: '8px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: 'secondary.dark', boxShadow: 'none' },
                          }}
                        >
                          {concluirModuloMutation.isPending ? 'Salvando progresso...' : 'Marcar capítulo como lido'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Fixed sidebar — no scroll ever ── */}
          {isLargeScreen && (
            <Box sx={{ width: 284, flexShrink: 0, bgcolor: 'background.default', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', opacity: 0.36, display: 'block', mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                  Conteúdo do Curso
                </Typography>
                <Box component="nav" sx={{ flexShrink: 0, overflowY: 'auto' }}>
                  {modulos.map((modulo, index) => (
                    <NavItem
                      key={modulo.id_modulo}
                      number={String(modulo.ordem ?? index + 1).padStart(2, '0')}
                      title={modulo.titulo}
                      meta={modulo.duracao ? `${modulo.duracao} min` : 'Módulo'}
                      isActive={activeId === modulo.id_modulo}
                      onClick={() => scrollToChapter(modulo.id_modulo)}
                    />
                  ))}
                </Box>
                <Box sx={{ flex: 1 }} />
                <Box sx={{ p: 2.5, borderRadius: 3, border: '2px dashed', borderColor: 'divider', textAlign: 'center', flexShrink: 0 }}>
                  <WorkspacePremiumIcon sx={{ fontSize: 26, color: 'secondary.main', opacity: 0.3, mb: 0.75, display: 'block', mx: 'auto' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', color: 'primary.main', mb: 0.5, fontSize: '0.64rem' }}>
                    Certificado Disponível
                  </Typography>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', opacity: 0.62, fontSize: '0.66rem', lineHeight: 1.5 }}>
                    Conclua todos os tópicos e realize o exame final para emitir seu selo de mestria.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CourseContentPage;