import api from './api';

const authService = {
  // Login
  login: (email, password) => {
    return api.post('api/auth/login', { email, password });
  },
  
  // Registro
  register: (userData) => {
    return api.post('api/auth/register', userData);
  },
  
  // Verificar token
  verifyToken: () => {
    return api.get('api/auth/verify');
  },
  
  // Recuperar senha
  forgotPassword: (email) => {
    return api.post('api/auth/forgot-password', { email });
  },
  
  // Redefinir senha
  resetPassword: (token, newPassword) => {
    return api.post('api/auth/reset-password', { token, newPassword });
  }
};

export default authService;