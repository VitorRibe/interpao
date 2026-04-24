import { useQuery } from '@tanstack/react-query';
import type { DashboardStats } from '../types';

// In a real app, this would use apiClient
const fetchStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    totalSales: 1250,
    activeOrders: 15,
    newCustomers: 8,
  };
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
