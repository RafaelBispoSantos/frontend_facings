import React, { useState, useEffect } from 'react';
import { Header, PageContainer } from '../../components/layout';
import { useFacings } from '../../components/hooks/useFacings';
import { useCategories } from '../../components/hooks/useCategories';
import { useStoreTypes } from '../../components/hooks/useStoreTypes';

import { formatCategoryName, formatStoreType, formatPercentage } from '../utils/formatters';
import { Button } from '../../components/ui';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const { spaces, isLoading } = useFacings();
  const { categories } = useCategories();
  const { storeTypes } = useStoreTypes();
  const [goalResults, setGoalResults] = useState({});
  const [stats, setStats] = useState({
    totalSpaces: 0,
    goalAchieved: 0,
    goalNotAchieved: 0,
    byCategory: {},
    byStoreType: {}
  });
  
  // Carregar metas para cada espaço
  useEffect(() => {
   const fetchGoalResults = async () => {
  try {
    const results = {};
    
    for (const space of spaces) {
      try {
        const response = await api.get(`/spaces/${space._id}/check-goal`);
        results[space._id] = response.data;
      } catch (error) {
        console.error(`Erro ao verificar meta para espaço ${space._id}:`, error);
      }
    }
    
    setGoalResults(results);
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
  }
};
    
    if (spaces.length > 0) {
      fetchGoalResults();
    }
  }, [spaces]);
  
  // Calcular estatísticas
  useEffect(() => {
    if (spaces.length === 0 || Object.keys(goalResults).length === 0) return;
    
    const newStats = {
      totalSpaces: spaces.length,
      goalAchieved: 0,
      goalNotAchieved: 0,
      byCategory: {},
      byStoreType: {}
    };
    
    // Inicializar contadores por categoria
    categories.forEach(category => {
      newStats.byCategory[category._id] = {
        name: category.name,
        totalSpaces: 0,
        goalAchieved: 0,
        goalNotAchieved: 0
      };
    });
    
    // Inicializar contadores por tipo de loja
    storeTypes.forEach(storeType => {
      newStats.byStoreType[storeType.name] = {
        name: storeType.description,
        totalSpaces: 0,
        goalAchieved: 0,
        goalNotAchieved: 0
      };
    });
    
    // Calcular estatísticas
    spaces.forEach(space => {
      const goalResult = goalResults[space._id];
      
      if (goalResult) {
        // Contadores gerais
        if (goalResult.achieved) {
          newStats.goalAchieved++;
        } else {
          newStats.goalNotAchieved++;
        }
        
        // Contadores por categoria
        if (newStats.byCategory[space.category?._id]) {
          newStats.byCategory[space.category._id].totalSpaces++;
          
          if (goalResult.achieved) {
            newStats.byCategory[space.category._id].goalAchieved++;
          } else {
            newStats.byCategory[space.category._id].goalNotAchieved++;
          }
        }
        
        // Contadores por tipo de loja
        if (newStats.byStoreType[space.storeType]) {
          newStats.byStoreType[space.storeType].totalSpaces++;
          
          if (goalResult.achieved) {
            newStats.byStoreType[space.storeType].goalAchieved++;
          } else {
            newStats.byStoreType[space.storeType].goalNotAchieved++;
          }
        }
      }
    });
    
    setStats(newStats);
  }, [spaces, goalResults, categories, storeTypes]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center p-8">Carregando...</div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header title="Dashboard" />
      
      {spaces.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
          <p className="text-gray-500 mb-4">
            Adicione espaços e medições para visualizar estatísticas.
          </p>
          <Button
            as={Link}
            to="/facings/add"
            variant="primary"
          >
            Adicionar Primeiro Espaço
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Resumo geral */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Resumo Geral</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">Total de Espaços</h4>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalSpaces}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800">Metas Atingidas</h4>
                  <p className="text-3xl font-bold text-green-600">{stats.goalAchieved}</p>
                  <p className="text-sm text-green-600">
                    {stats.totalSpaces > 0 ? formatPercentage((stats.goalAchieved / stats.totalSpaces) * 100) : '0%'}
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800">Metas Não Atingidas</h4>
                  <p className="text-3xl font-bold text-red-600">{stats.goalNotAchieved}</p>
                  <p className="text-sm text-red-600">
                    {stats.totalSpaces > 0 ? formatPercentage((stats.goalNotAchieved / stats.totalSpaces) * 100) : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Estatísticas por categoria */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Por Categoria</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atingidas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Não Atingidas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Sucesso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.values(stats.byCategory)
                      .filter(cat => cat.totalSpaces > 0)
                      .map((category, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCategoryName(category.name)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {category.totalSpaces}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                            {category.goalAchieved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                            {category.goalNotAchieved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatPercentage((category.goalAchieved / category.totalSpaces) * 100)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Estatísticas por tipo de loja */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Por Tipo de Loja</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Loja
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Atingidas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Não Atingidas
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Sucesso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.values(stats.byStoreType)
                      .filter(st => st.totalSpaces > 0)
                      .map((storeType, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatStoreType(storeType.name)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {storeType.totalSpaces}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                            {storeType.goalAchieved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                            {storeType.goalNotAchieved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatPercentage((storeType.goalAchieved / storeType.totalSpaces) * 100)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Lista de espaços com metas não atingidas */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Espaços com Metas Não Atingidas</h3>
            </div>
            <div className="p-6">
              {spaces.filter(space => goalResults[space._id] && !goalResults[space._id].achieved).length === 0 ? (
                <p className="text-center text-gray-500">Parabéns! Todas as metas foram atingidas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Espaço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Loja
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Atual
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Meta
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {spaces
                        .filter(space => goalResults[space._id] && !goalResults[space._id].achieved)
                        .map((space, index) => (
                          <tr key={space._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {space.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCategoryName(space.category?.name)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatStoreType(space.storeType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                              {goalResults[space._id] && formatPercentage(goalResults[space._id].percentage)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {goalResults[space._id] && (
                                goalResults[space._id].isMinimum 
                                  ? `Min: ${formatPercentage(goalResults[space._id].goalPercentage)}`
                                  : `Max: ${formatPercentage(goalResults[space._id].goalPercentage)}`
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <Button
                                as={Link}
                                to={`/facings/${space._id}/add-measurement`}
                                variant="primary"
                                size="sm"
                              >
                                Adicionar Medição
                              </Button>
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
      )}
    </PageContainer>
  );
};

export default Dashboard;