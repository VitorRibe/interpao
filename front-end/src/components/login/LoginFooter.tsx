import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled('footer')(({ theme }) => ({
  color: 'rgba(68, 42, 34, 0.6)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 3),
  textAlign: 'center',
  width: '100%',
  marginTop: 'auto',
}));

const SecurityText = styled(Typography)({
  fontSize: '0.75rem',
  lineHeight: 1.6,
  marginBottom: '4px',
  opacity: 0.8,
  maxWidth: '500px',
  fontFamily: '"Kumbh Sans", sans-serif',
});

const Copyright = styled(Typography)({
  fontSize: '0.625rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 700,
  marginTop: '12px',
  fontFamily: '"Kumbh Sans", sans-serif',
});

const LoginFooter: React.FC = () => {
  return (
    <FooterContainer>
      <SecurityText>
        Este é um sistema interno seguro. Capturas de tela e compartilhamento de informações são
        estritamente proibidos.
      </SecurityText>
      <Copyright>
        © 2026 INTER PÃO.
      </Copyright>
    </FooterContainer>
  );
};

export default LoginFooter;
