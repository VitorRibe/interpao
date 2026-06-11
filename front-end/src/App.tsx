import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeTrailPage from './pages/KnowledgeTrailPage';
import CourseContentPage from './pages/CourseContentPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminUsersPage from './pages/AdminUsersPage';
import SettingsPage from './pages/SettingsPage';
import EscalaPage from './pages/EscalaPage';
import ReceitasPage from './pages/ReceitasPage';
import BenefitsPage from './pages/BenefitsPage';
import Layout from './components/Layout';
import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Routes with Global Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trilha" element={<KnowledgeTrailPage />} />
        <Route path="/curso/:id" element={<CourseContentPage />} />
        <Route
          path="/admin/conteudo"
          element={
            <RequireAdmin>
              <AdminContentPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RequireAdmin>
              <AdminUsersPage />
            </RequireAdmin>
          }
        />
        <Route path="/configuracoes" element={<SettingsPage />} />
        {/* Placeholder for other routes */}
        <Route path="/receita" element={<ReceitasPage />} />
        <Route path="/escala" element={<EscalaPage />} />
        <Route path="/beneficios" element={<BenefitsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

