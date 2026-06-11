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

// ─── Learning content domain (mirrors back-end src/content DTOs) ───────────────

export interface Setor {
  id_setor: string;
  nome: string;
}

export interface Multimidia {
  id_multimidia: string;
  id_modulo: string | null;
  titulo: string;
  url: string | null;
  tipo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Modulo {
  id_modulo: string;
  id_trilha: string | null;
  titulo: string;
  descricao: string | null;
  conteudo: string | null;
  duracao: number | null;
  ordem: number | null;
  created_at: string;
  updated_at: string;
  multimidia: Multimidia[];
}

export interface TrilhaSummary {
  id_trilha: string;
  titulo: string;
  descricao: string | null;
  carga_hor: number | null;
  id_setor: string | null;
  created_at: string;
  updated_at: string;
  setor: Setor | null;
  module_count: number;
}

export interface Trilha extends TrilhaSummary {
  modulos: Modulo[];
}

// ─── Write payloads ────────────────────────────────────────────────────────────

export interface TrilhaCreate {
  titulo: string;
  descricao?: string | null;
  carga_hor?: number | null;
  id_setor?: string | null;
}

export type TrilhaUpdate = Partial<TrilhaCreate>;

export interface ModuloCreate {
  id_trilha: string;
  titulo: string;
  descricao?: string | null;
  conteudo?: string | null;
  duracao?: number | null;
  ordem?: number | null;
}

export type ModuloUpdate = Partial<Omit<ModuloCreate, 'id_trilha'>> & {
  id_trilha?: string;
};

export interface MultimidiaCreate {
  titulo: string;
  url?: string | null;
  tipo?: string | null;
}

// ─── Admin user management ─────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  cargo: string | null;
  setor: Setor;
  is_active: boolean;
}

export interface AdminCreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string | null;
  cargo?: string | null;
  id_setor: string;
}

export interface AdminUpdateUserRequest {
  email?: string;
  name?: string;
  phone?: string | null;
  cargo?: string | null;
  id_setor?: string;
  is_active?: boolean;
}

export interface AdminListUsersResponse {
  total: number;
  page: number;
  size: number;
  users: AdminUser[];
}
