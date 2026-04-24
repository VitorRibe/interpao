import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Container,
  Stack,
  alpha
} from '@mui/material';
import { 
  Code as CodeIcon,
  Storage as StorageIcon,
  FlashOn as FlashOnIcon,
  Palette as PaletteIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';

const TechCard = ({ icon: Icon, name, version, color }: { icon: any, name: string, version: string, color: string }) => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 4, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      borderRadius: 5,
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '100%',
      backgroundColor: 'white',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${alpha(color, 0.12)}`,
        borderColor: alpha(color, 0.5),
      }
    }}
  >
    <Box 
      sx={{ 
        width: 64, 
        height: 64, 
        borderRadius: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: alpha(color, 0.08), 
        color: color, 
        mb: 3,
        fontSize: '2rem'
      }}
    >
      <Icon fontSize="inherit" />
    </Box>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, textAlign: 'center', color: 'text.primary' }}>
      {name}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: alpha(color, 0.8), bgcolor: alpha(color, 0.05), px: 1.5, py: 0.5, borderRadius: 1.5 }}>
      {version}
    </Typography>
  </Paper>
);

const HomePage: React.FC = () => {
  const technologies = [
    { icon: CodeIcon, name: "React", version: "v19.0", color: "#61DAFB" },
    { icon: DevicesIcon, name: "TypeScript", version: "v5.7", color: "#3178C6" },
    { icon: PaletteIcon, name: "Material UI", version: "v9.0", color: "#007FFF" },
    { icon: StorageIcon, name: "TanStack Query", version: "v5.6", color: "#FF4154" },
    { icon: FlashOnIcon, name: "Vite", version: "v6.1", color: "#646CFF" },
    { icon: CodeIcon, name: "Axios", version: "v1.7", color: "#5A29E4" },
  ];

  return (
    <Container maxWidth="lg" sx={{ px: 3 }}>
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ mb: 10, alignItems: 'center' }}>
      
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 900, 
              letterSpacing: '-2px', 
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: '#1e293b'
            }}
          >
            Front-End #InterPão
          </Typography>

        </Stack>

        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3, 
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr'
            },
            mb: 10
          }}
        >
          {technologies.map((tech, index) => (
            <TechCard key={index} {...tech} />
          ))}
        </Box>

        <Box 
          sx={{ 
            p: { xs: 5, md: 8 }, 
            borderRadius: 8, 
            bgcolor: '#ffffff', 
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#1e293b' }}>
            Pronto para o próximo passo?
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 650, mx: 'auto', mb: 0, fontSize: '1.1rem' }}>
            A arquitetura de diretórios está pronta para receber suas rotas, componentes globais e lógica de negócios.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
