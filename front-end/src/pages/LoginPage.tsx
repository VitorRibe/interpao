import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginCard from '../components/login/LoginCard';
import LoginFooter from '../components/login/LoginFooter';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#faf9f8',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #faf9f8 0%, #f4f3f2 100%)',
});

const MainContent = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  position: 'relative',
  zIndex: 1,
});

// Background accents
const AccentTop = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '384px',
  height: '384px',
  backgroundColor: 'rgba(68, 42, 34, 0.05)',
  borderRadius: '50%',
  filter: 'blur(100px)',
  marginRight: '-192px',
  marginTop: '-192px',
});

const AccentBottom = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '320px',
  height: '320px',
  backgroundColor: 'rgba(127, 86, 0, 0.05)',
  borderRadius: '50%',
  filter: 'blur(80px)',
  marginLeft: '-160px',
  marginBottom: '-160px',
});

const LoginPage: React.FC = () => {
  return (
    <PageWrapper>
      <AccentTop />
      <AccentBottom />
      
      <MainContent>
        <LoginCard />
      </MainContent>

      <LoginFooter />
    </PageWrapper>
  );
};

export default LoginPage;
