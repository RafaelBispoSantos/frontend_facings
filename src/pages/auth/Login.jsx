import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import { useAuth } from '../../components/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/facings');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
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
          />
        </div>
        
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          Sistema de Medição de Facings
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 md:text-base">
          Faça login para continuar
        </p>
      </div>

      <div className="mt-6 mx-auto w-full max-w-md">
        <div className="bg-white px-6 py-8 shadow-xl rounded-xl">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="seu@email.com"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/register"
                className="inline-block font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Registre-se agora
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 Sistema de Medição de Facings. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;