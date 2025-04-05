import api from './api';

const authService = {
  // Login
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  // Registro
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Verificar token
  verifyToken: () => {
    return api.get('/auth/verify');
  },
  
  // Recuperar senha
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  // Redefinir senha
  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  }
};

export default authService;