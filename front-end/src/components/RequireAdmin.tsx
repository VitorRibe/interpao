import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useCurrentUser } from '../hooks/useCurrentUser';

/**
 * Gates admin-only routes. Reads the authenticated user and redirects
 * non-admins to the dashboard. The back-end still enforces is_admin on
 * every write endpoint — this is purely a UX guard.
 */
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  if (isError || !user || !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
