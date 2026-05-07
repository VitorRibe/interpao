import React from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Link, 
  Stack,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLabel = styled(InputLabel)(({ theme }) => ({
  fontFamily: '"Kumbh Sans", sans-serif',
  fontSize: '9px',
  fontWeight: 800,
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  marginBottom: '8px',
  marginLeft: '4px',
}));

const ForgotPasswordLink = styled(Link)(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 800,
  color: theme.palette.secondary.main,
  textDecoration: 'none',
  '&:hover': {
    color: '#ffb632',
  },
  transition: 'color 0.2s ease-in-out',
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: '#f4f3f2',
    borderRadius: '8px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '0.875rem',
    fontFamily: '"Kumbh Sans", sans-serif',
    color: '#442a22',
    '&::placeholder': {
      color: 'rgba(68, 42, 34, 0.3)',
      opacity: 1,
    },
  },
});

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '14px',
  fontSize: '0.8125rem',
  fontWeight: 800,
  letterSpacing: '0.1em',
  borderRadius: '8px',
  marginTop: '8px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.95,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const LoginForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
      <Stack spacing={2.5}>
        <Box>
          <StyledLabel htmlFor="username">E-mail ou Usuário</StyledLabel>
          <StyledTextField
            id="username"
            name="username"
            placeholder="exemplo@interpao.com.br"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <StyledLabel htmlFor="password" sx={{ mb: 0 }}>Senha</StyledLabel>
            <ForgotPasswordLink href="#">Esqueci minha senha</ForgotPasswordLink>
          </Stack>
          <StyledTextField
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box sx={{ pt: 1 }}>
          <LoginButton variant="contained" fullWidth type="submit">
            LOGIN
          </LoginButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginForm;
