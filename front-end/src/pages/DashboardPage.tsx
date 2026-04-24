import React from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { useStats } from '../hooks/useStats';

const DashboardPage: React.FC = () => {
  const { data, isLoading, isError, error } = useStats();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading dashboard data: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="subtitle1">Total Sales</Typography>
            <Typography variant="h3">${data?.totalSales}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            <Typography variant="subtitle1">Active Orders</Typography>
            <Typography variant="h3">{data?.activeOrders}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%', bgcolor: 'success.light', color: 'common.white' }}>
            <Typography variant="subtitle1">New Customers</Typography>
            <Typography variant="h3">{data?.newCustomers}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <Typography variant="body2" color="text.secondary">
            Data fetched using TanStack Query. Refetching and state management are handled automatically.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
