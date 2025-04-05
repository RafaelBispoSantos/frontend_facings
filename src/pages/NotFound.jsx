import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Página não encontrada</h1>
          <p className="mt-2 text-base text-gray-500">
            Desculpe, não encontramos a página que você está procurando.
          </p>
          <div className="mt-6">
            <Button
              as={Link}
              to="/"
              variant="primary"
            >
              Voltar para o início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;