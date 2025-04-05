import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Alert } from '../../components/ui';
import { useAuth } from '../../components/hooks/useAuth';
import { isValidEmail, isValidPassword } from '../utils/validators';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const { register } = useAuth();
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro ao editar campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não correspondem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulário submetido');
    
    if (!validateForm()) {
      console.log('Validação falhou');
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    console.log('IsSubmitting definido como true');
    
    try {
      console.log('Tentando registrar usuário...');
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registro concluído:', result);
      
      // Mostrar alerta de sucesso
      setShowSuccessAlert(true);
      
      // Aguardar alguns segundos para o usuário ver o alerta antes de redirecionar
      setTimeout(() => {
        // Armazenar a mensagem no sessionStorage para recuperá-la após o redirecionamento
        sessionStorage.setItem('registerSuccessMessage', 'Cadastro realizado com sucesso! Faça login para continuar.');
        
        // Redirecionar para login usando window.location para recarregar a página completamente
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      console.error('Erro no registro:', err);
      
      // Tratamento de erro mais robusto
      let errorMessage = 'Erro ao registrar. Tente novamente.';
      
      if (err.response) {
        // Resposta do servidor com código de erro
        errorMessage = err.response.data?.message || `Erro ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        // Requisição feita mas sem resposta
        errorMessage = 'Servidor não respondeu. Verifique sua conexão.';
      } else if (err.message) {
        // Erro específico
        errorMessage = err.message;
      }
      
      setServerError(errorMessage);
    } finally {
      console.log('Finally executado');
      setIsSubmitting(false);
      console.log('IsSubmitting definido como false');
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-b from-blue-50 to-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/icon.png" 
            alt="Logo" 
            className="h-40 w-auto" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/favicon.ico';
              console.log('Imagem principal não encontrada, usando fallback.');
            }}
          />
        </div>
        
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          Criar nova conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 md:text-base">
          Preencha os dados abaixo para se registrar
        </p>
      </div>

      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white px-6 py-8 shadow-xl rounded-xl">
          {/* Alerta de sucesso */}
          {showSuccessAlert && (
            <Alert
              type="success"
              title="Cadastro Realizado!"
              message="Seu cadastro foi realizado com sucesso. Você será redirecionado para a página de login."
              className="mb-6"
            />
          )}
          
          {/* Alerta de erro */}
          {serverError && (
            <Alert
              type="error"
              title="Erro no cadastro"
              message={serverError}
              className="mb-6"
            />
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processando...' : 'Registrar'}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 Sistema de Medição de Facings. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Register;