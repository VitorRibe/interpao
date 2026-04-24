export type DashboardStats = {
  totalSales: number;
  activeOrders: number;
  newCustomers: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};
