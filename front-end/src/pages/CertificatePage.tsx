import React, { useMemo } from 'react';
import { Box, Typography, Button, Paper, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Tema específico para impressão e visualização do certificado
const certTheme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 900 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  },
});

const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();

  // Data atual formatada (ex: 23 de Junho de 2026)
  const dataConclusao = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    }).format(new Date());
  }, []);

  // Lendo as propriedades baseadas estritamente no seu types.ts e com cast seguro para o setor
  const userName = currentUser?.name || 'Colaborador';
  const userSector = (currentUser as any)?.setor?.nome?.toUpperCase() || 'GERAL';

  // Cores dinâmicas por setor para dar a diferenciação solicitada
  const sectorColor = useMemo(() => {
    switch(userSector) {
      case 'ATENDIMENTO': return '#c9883d'; // Dourado
      case 'PRODUÇÃO': return '#7f5600'; // Marrom escuro
      case 'ADMINISTRATIVO': return '#455a64'; // Azul acinzentado
      default: return '#2c1a0e'; // Padrão Interpão
    }
  }, [userSector]);

  return (
    <ThemeProvider theme={certTheme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#e9e8e7', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        py: 4, px: 2 
      }}>
        
        {/* Controles da Tela (Ocultos na hora de imprimir) */}
        <Box className="no-print" sx={{ display: 'flex', gap: 2, mb: 4, width: '100%', maxWidth: 1000, justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/trilha')}
            sx={{ color: '#2c1a0e', fontWeight: 700 }}
          >
            Voltar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PrintIcon />} 
            onClick={() => window.print()}
            sx={{ bgcolor: '#2c1a0e', color: '#fff', fontWeight: 800, '&:hover': { bgcolor: '#000' } }}
          >
            Salvar como PDF
          </Button>
        </Box>

        {/* O Certificado em si (Formato A4 Paisagem) */}
        <Paper 
          elevation={12} 
          sx={{
            width: '100%',
            maxWidth: 1056, // Proporção A4 landscape (aprox 1056x816 px)
            height: 816,
            bgcolor: '#faf6f0',
            position: 'relative',
            overflow: 'hidden',
            p: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            border: `16px solid ${sectorColor}`, // Borda muda de acordo com o setor
            '@media print': {
              border: `8px solid ${sectorColor}`,
              boxShadow: 'none',
              width: '100vw',
              height: '100vh',
              maxWidth: 'none',
              m: 0,
              p: 6
            }
          }}
        >
          {/* Marca d'água de fundo */}
          <WorkspacePremiumIcon sx={{ 
            position: 'absolute', fontSize: 600, color: sectorColor, opacity: 0.03, zIndex: 0 
          }} />

          <Box sx={{ zIndex: 1, position: 'relative', width: '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.3em', color: sectorColor, mb: 2, display: 'block' }}>
              PADARIA INTERPÃO
            </Typography>
            
            <Typography variant="h2" sx={{ color: '#2c1a0e', mb: 6, fontSize: '4rem' }}>
              Certificado de Mestria
            </Typography>

            <Typography variant="body1" sx={{ color: '#504441', fontSize: '1.2rem', mb: 2 }}>
              Certificamos para os devidos fins que
            </Typography>

            <Typography variant="h4" sx={{ color: '#c9883d', fontSize: '3rem', mb: 2, textTransform: 'capitalize' }}>
              {userName}
            </Typography>

            <Typography variant="body1" sx={{ color: '#504441', fontSize: '1.2rem', maxWidth: 700, mx: 'auto', mb: 8, lineHeight: 1.8 }}>
              Concluiu com excelência todos os módulos e requisitos do programa de formação corporativa, demonstrando domínio técnico e prático nas operações do setor de <strong>{userSector}</strong>.
            </Typography>

            {/* Rodapé do Certificado */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', px: 8 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#2c1a0e', fontWeight: 700, borderBottom: '1px solid #2c1a0e', pb: 0.5, mb: 0.5, minWidth: 200 }}>
                  {dataConclusao}
                </Typography>
                <Typography variant="caption" sx={{ color: '#7a6a5a', letterSpacing: '0.1em' }}>
                  DATA DE EMISSÃO
                </Typography>
              </Box>

              {/* Selo do Setor */}
              <Box sx={{ 
                width: 120, height: 120, borderRadius: '50%', border: `4px dashed ${sectorColor}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: sectorColor, bgcolor: 'rgba(255,255,255,0.5)'
              }}>
                <WorkspacePremiumIcon sx={{ fontSize: 40, mb: 0.5 }} />
                <Typography sx={{ fontSize: '0.55rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                  PADRÃO
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 900 }}>
                  {userSector}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#2c1a0e', fontWeight: 700, borderBottom: '1px solid #2c1a0e', pb: 0.5, mb: 0.5, minWidth: 200, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.2rem' }}>
                  Diretoria Interpão
                </Typography>
                <Typography variant="caption" sx={{ color: '#7a6a5a', letterSpacing: '0.1em' }}>
                  ASSINATURA OFICIAL
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Estilo injetado para esconder elementos na hora de gerar o PDF e forçar cores */}
        <style>
          {`
            @media print {
              body { 
                background-color: #fff; 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              @page { size: landscape; margin: 0; }
            }
          `}
        </style>
      </Box>
    </ThemeProvider>
  );
};

export default CertificatePage;