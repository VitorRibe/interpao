import React from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';

const SIDEBAR_WIDTH = 288;

const Layout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: user } = useCurrentUser();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'JS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };


  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Trilha do Conhecimento', icon: 'route', path: '/trilha' },
    { label: 'Receita', icon: 'menu_book', path: '/receita' },
    { label: 'Escala', icon: 'straighten', path: '/escala' },
    { label: 'Benefícios', icon: 'workspace_premium', path: '/beneficios' },
  ];

  const bottomNavItems = [
    { label: 'Home', icon: 'dashboard', path: '/dashboard' },
    { label: 'Trilha', icon: 'route', path: '/trilha' },
    { label: 'Receitas', icon: 'menu_book', path: '/receita' },
    { label: 'Benefícios', icon: 'workspace_premium', path: '/beneficios' },
  ];

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ mb: 5, px: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Inter Pão
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, py: 0 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor: active ? '#ffffff' : 'transparent',
                  color: active ? 'secondary.main' : 'primary.main',
                  borderLeft: active ? `4px solid ${theme.palette.secondary.main}` : '4px solid transparent',
                  boxShadow: active ? '0px 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                  '&:hover': {
                    bgcolor: active ? '#ffffff' : 'surface-container-low',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: 'inherit',
                  }}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={RouterLink}
              to="/configuracoes"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: 'primary.main',
                '&:hover': { bgcolor: 'background.default' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <span className="material-symbols-outlined">settings</span>
              </ListItemIcon>
              <ListItemText
                primary="Configurações"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', opacity: 0.1 },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <span className="material-symbols-outlined">logout</span>
              </ListItemIcon>
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          pb: isMobile ? 8 : 0,
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                }}
              >
                {location.pathname === '/trilha' 
                  ? 'Trilha do Conhecimento' 
                  : location.pathname.startsWith('/curso/') 
                    ? 'Mestria em Fermentação Natural' 
                    : 'Dashboard Interativo'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {location.pathname === '/trilha' 
                    ? 'PORTAL DE DESCOBERTA' 
                    : location.pathname.startsWith('/curso/') 
                      ? 'EDUCAÇÃO TÉCNICA' 
                      : 'Visão Geral do Colaborador'}
                </Typography>
                {(location.pathname === '/trilha' || location.pathname.startsWith('/curso/')) && (
                  <>
                    <Box sx={{ width: 4, height: 4, bgcolor: 'secondary.main', borderRadius: '50%', opacity: 0.5, mx: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'secondary.main',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {location.pathname.startsWith('/curso/') ? 'MÓDULO AVANÇADO' : 'MÓDULOS DISPONÍVEIS'}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {location.pathname.startsWith('/curso/') && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    borderRadius: '10px',
                    px: 2.5,
                    textTransform: 'none',
                    boxShadow: 'none',
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                  }}
                >
                  Concluir Módulo
                </Button>
              )}
              <Avatar
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '2px solid',
                  borderColor: 'divider',
                  width: 40,
                  height: 40,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </Box>

          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, p: { xs: 3, md: 5 }, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Bottom Navigation Mobile */}
      {isMobile && (
        <BottomNavigation
          value={location.pathname}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
            height: 72,
            bgcolor: 'rgba(250, 249, 248, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              value={item.path}
              component={RouterLink}
              to={item.path}
              icon={<span className="material-symbols-outlined">{item.icon}</span>}
              sx={{
                color: 'primary.main',
                '&.Mui-selected': {
                  color: 'secondary.main',
                  '& .MuiBottomNavigationAction-label': {
                    fontWeight: 800,
                  },
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  mt: 0.5,
                },
              }}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
};

export default Layout;
