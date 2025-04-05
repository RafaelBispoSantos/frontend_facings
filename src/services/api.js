import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratar erros específicos
    if (error.response && error.response.status === 401) {
      // Redirecionar para página de login ou limpar autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Verificar se não estamos em uma página de autenticação
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;