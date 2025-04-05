import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login, Register, ForgotPassword } from './pages/auth';
import { FacingsList, FacingDetail, AddSpace, AddMeasurement } from './pages/facings';
import { Dashboard, Reports } from './pages/dashboard';
import { Profile, AppSettings } from './pages/settings';

import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout
import AuthLayout from './components/layout/AuthLayout';
import PageContainer from './components/layout/PageContainer';

// Auth Guard - Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Rotas da aplicação
const routes = [
  // Rotas públicas
  {
    path: '/',
    element:<Login/>,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  
  // Rotas protegidas
  {
    path: '/facings',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <FacingsList />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  {
    path: '/facings/:id',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <FacingDetail />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  {
    path: '/facings/add',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <AddSpace />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  {
    path: '/facings/:id/add-measurement',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <AddMeasurement />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  
  // Dashboard
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <Dashboard />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <Reports />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  
  // Configurações
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <Profile />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <PageContainer>
          <AppSettings />
        </PageContainer>
      </ProtectedRoute>
    ),
  },
  
  // Páginas de erro
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;