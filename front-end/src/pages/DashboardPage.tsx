import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useMinimumLoadingTime } from '../hooks/useMinimumLoadingTime';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import SkeletonTransition from '../components/skeletons/SkeletonTransition';

const DashboardPage: React.FC = () => {
  const { data: user, isLoading, isError, error } = useCurrentUser();
  const showSkeleton = useMinimumLoadingTime(isLoading, 200);

  return (
    <SkeletonTransition showSkeleton={showSkeleton} skeleton={<DashboardSkeleton />}>
      <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'flex' }}>
        <Paper
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #faf9f8 100%)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 8,
            boxShadow: '0px 32px 64px -12px rgba(68, 42, 34, 0.04)',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: 'primary.main',
                  mb: 1,
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                Olá, {user?.name?.split(' ')[0] || 'Colaborador'}!
              </Typography>
              {user?.company?.name && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.875rem',
                  }}
                >
                  {user.company.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>
    </SkeletonTransition>
  );
};

export default DashboardPage;
