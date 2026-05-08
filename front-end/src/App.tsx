import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeTrailPage from './pages/KnowledgeTrailPage';
import CourseContentPage from './pages/CourseContentPage';
import Layout from './components/Layout';

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
        {/* Placeholder for other routes */}
        <Route path="/receita" element={<div>Receita Content</div>} />
        <Route path="/escala" element={<div>Escala Content</div>} />
        <Route path="/beneficios" element={<div>Benefícios Content</div>} />
      </Route>
    </Routes>
  );
}

export default App;

