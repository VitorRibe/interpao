import React from 'react';
import { Box, Paper, Typography, Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../../assets/logo.svg';
import LoginForm from './LoginForm';

const StyledPaper = styled(Paper)({
  backgroundColor: '#ffffff',
  padding: '48px 40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '440px',
  width: '100%',
  borderRadius: '12px',
  boxShadow: '0px 32px 64px -12px rgba(68, 42, 34, 0.06)',
});

const LogoContainer = styled(Box)({
  width: '120px',
  height: '102px', // Slightly less to keep it proportional if it's horizontal
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '28px',
});

const LogoImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const DividerText = styled(Typography)({
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'rgba(130, 116, 112, 0.4)',
  fontWeight: 800,
  padding: '0 16px',
  whiteSpace: 'nowrap',
});

const LoginCard: React.FC = () => {
  return (
    <StyledPaper elevation={0}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <LogoContainer>
          <LogoImage 
            src={logo} 
            alt="Inter Pão logo" 
          />
        </LogoContainer>
        <Typography 
          variant="h3" 
          sx={{ color: 'primary.main', mb: 0.5, fontSize: '1.5rem', fontWeight: 800 }}
        >
          Bem-vindo
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '0.8125rem' }}
        >
          Acesse sua conta Inter Pão
        </Typography>
      </Box>

      <LoginForm />

      <Stack direction="row" sx={{ alignItems: 'center', width: '100%', mt: 5 }}>
        <Divider sx={{ flexGrow: 1, borderColor: 'rgba(212, 195, 190, 0.2)' }} />
        <DividerText>Portal do Colaborador</DividerText>
        <Divider sx={{ flexGrow: 1, borderColor: 'rgba(212, 195, 190, 0.2)' }} />
      </Stack>
    </StyledPaper>
  );
};

export default LoginCard;
