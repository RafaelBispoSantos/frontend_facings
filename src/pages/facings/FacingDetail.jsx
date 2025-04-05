// src/pages/facings/FacingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const FacingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, você faria uma chamada API aqui
    setLoading(true);
    
    // Simulando um atraso de rede
    const timer = setTimeout(() => {
      // Dados de exemplo
      if (id) {
        setSpace({
          _id: id,
          name: 'Espaço exemplo',
          totalSpace: 100,
          category: { name: 'Categoria exemplo' },
          storeType: 'varejo',
          measurements: [
            { _id: '1', productType: 'Produto A', allocatedSpace: 35, createdAt: new Date() },
            { _id: '2', productType: 'Produto B', allocatedSpace: 25, createdAt: new Date() }
          ]
        });
        setLoading(false);
      } else {
        setError('ID do espaço não fornecido');
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/facings')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar para lista de espaços
          </button>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Espaço não encontrado</h2>
          <p className="text-gray-600 mb-6">O espaço que você está procurando não existe ou foi removido.</p>
          <button 
            onClick={() => navigate('/facings')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar para lista de espaços
          </button>
        </div>
      </div>
    );
  }

  // Calcular espaço utilizado
  const usedSpace = space.measurements.reduce((sum, m) => sum + m.allocatedSpace, 0);
  const usedPercentage = ((usedSpace / space.totalSpace) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          <Link
            to="/facings"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Voltar para lista
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Detalhes do Espaço</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome do Espaço</dt>
                <dd className="mt-1 text-sm text-gray-900">{space.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Categoria</dt>
                <dd className="mt-1 text-sm text-gray-900">{space.category.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo de Loja</dt>
                <dd className="mt-1 text-sm text-gray-900">{space.storeType === 'varejo' ? 'Varejo' : 
                  space.storeType === 'atacarejo' ? 'Atacarejo' : 'Contas Globais'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Espaço Total</dt>
                <dd className="mt-1 text-sm text-gray-900">{space.totalSpace} cm</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Espaço Utilizado</dt>
                <dd className="mt-1 text-sm text-gray-900">{usedSpace} cm ({usedPercentage}%)</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Espaço Restante</dt>
                <dd className="mt-1 text-sm text-gray-900">{space.totalSpace - usedSpace} cm</dd>
              </div>
            </dl>

            {/* Barra de progresso */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${usedPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-right">{usedPercentage}% utilizado</p>
            </div>
          </div>
        </div>

        {/* Medições */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Medições</h2>
            <Link
              to={`/facings/${id}/add-measurement`}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Adicionar Medição
            </Link>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {space.measurements.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma medição registrada para este espaço.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Espaço (cm)
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % do Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {space.measurements.map((measurement) => (
                      <tr key={measurement._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {measurement.productType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {measurement.allocatedSpace}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {((measurement.allocatedSpace / space.totalSpace) * 100).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {new Date(measurement.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacingDetail;