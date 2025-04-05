import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/hooks/useAuth';

// Importações de páginas

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import FacingsList from './pages/facings/FacingsList';
import FacingDetail from './pages/facings/FacingDetail';
import AddSpace from './pages/facings/AddSpace';
import AddMeasurement from './pages/facings/AddMeasurement';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mostrar algum indicador de carregamento se ainda estiver verificando autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
             <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/facings" replace /> : 
              <Login />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Rotas protegidas */}
        <Route 
          path="/facings" 
          element={
            <ProtectedRoute>
              <FacingsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/facings/:id" 
          element={
            <ProtectedRoute>
              <FacingDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/facings/add" 
          element={
            <ProtectedRoute>
              <AddSpace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/facings/:id/add-measurement" 
          element={
            <ProtectedRoute>
              <AddMeasurement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );

}
export default App;