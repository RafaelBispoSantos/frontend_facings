import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';

const Header = ({ title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title || 'Sistema de Medição de Facings'}</h1>
         
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="mr-4 text-sm text-gray-600">
              Olá, <span className="font-medium">{user.name}</span>
            </div>
          )}

         
      

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string
};

export default Header;