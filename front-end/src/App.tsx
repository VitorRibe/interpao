import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeTrailPage from './pages/KnowledgeTrailPage';
import CourseContentPage from './pages/CourseContentPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProgressoPage from './pages/AdminProgressoPage';
import SettingsPage from './pages/SettingsPage';
import EscalaPage from './pages/EscalaPage';
import ReceitasPage from './pages/ReceitasPage';
import BenefitsPage from './pages/BenefitsPage';
import DocumentsPage from './pages/DocumentsPage';
import Layout from './components/Layout';
import RequireAdmin from './components/RequireAdmin';
import { useCurrentUser } from './hooks/useCurrentUser';

const RequireOfficeOrAdmin = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) return null;
  
  const setorLower = user?.setor?.nome?.toLowerCase() || '';
  const canView = user?.is_admin || setorLower.includes('administrativo') || setorLower.includes('escritório') || setorLower.includes('escritorio');
  
  if (!canView) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trilha" element={<KnowledgeTrailPage />} />
        <Route path="/curso/:id" element={<CourseContentPage />} />
        
        <Route path="/admin/conteudo" element={<RequireAdmin><AdminContentPage /></RequireAdmin>} />
        <Route path="/admin/usuarios" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
        
        <Route path="/admin/progresso" element={<RequireOfficeOrAdmin><AdminProgressoPage /></RequireOfficeOrAdmin>} />
        
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="/receita" element={<ReceitasPage />} />
        <Route path="/escala" element={<EscalaPage />} />
        <Route path="/beneficios" element={<BenefitsPage />} />
        <Route path="/documentos" element={<DocumentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;