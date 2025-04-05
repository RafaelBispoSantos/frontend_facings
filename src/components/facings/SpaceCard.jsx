import React from 'react';
import PropTypes from 'prop-types';
import { GoalStatus } from '../facings';
import { Button } from '../ui';
import { CategoryIcon } from '../facings';

const SpaceCard = ({
  space,
  storeTypes,
  goalResult,
  onDelete,
  onAddMeasurement,
  calculateUsedPercentage
}) => {
  // Verificar se há medições
  const hasMeasurements = space.measurements && space.measurements.length > 0;
  
  // Obter a medição mais recente (se houver)
  const latestMeasurement = hasMeasurements 
    ? space.measurements[space.measurements.length - 1] 
    : null;

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este espaço? Todas as medições serão removidas.')) {
      onDelete(space._id);
    }
  };  

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <CategoryIcon category={space.category?.name} className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {space.name || `Medição ${space._id?.substring(0, 8) || ''}`}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Categoria:</span> {space.category?.name || 'N/A'} 
                <span className="mx-2">•</span>
                <span className="font-medium">Tipo de Loja:</span> {
                  storeTypes.find(st => st.name === space.storeType)?.description || space.storeType
                }
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 sm:flex-none py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
              onClick={() => onAddMeasurement(space)}
            >
              Atualizar Medição
            </Button>

            <Button
              variant="danger"
              size="sm"
              className="flex-1 sm:flex-none py-2 px-3 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-medium rounded-lg shadow-sm transition-colors text-sm"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </div>
        </div>
      
        {/* Regra aplicável */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="font-medium text-blue-800 text-sm">Regra aplicável:</p>
          <p className="text-sm text-blue-700">
            {space.category?.rules?.[space.storeType]?.description || 'Sem regra definida'}
          </p>
        </div>
      
        {/* Informações do espaço */}
        <div>
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm font-medium text-gray-700">
              Espaço Total: <span className="font-bold">{space.totalSpace} cm</span>
            </p>
          </div>
        
          {hasMeasurements ? (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              {/* Exibir informações da medição recente */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-gray-700">Última Medição</h4>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                  {new Date(latestMeasurement.createdAt).toLocaleDateString() || 'Data não disponível'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Produto:</span> {latestMeasurement.productType}
              </p>
              
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Espaço Total: {latestMeasurement.totalSpace} cm</span>
                <span>Espaço Alocado: {latestMeasurement.allocatedSpace} cm</span>
              </div>
              
              {/* Barra de progresso - só exibir se houver medições */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${((latestMeasurement.allocatedSpace / latestMeasurement.totalSpace) * 100).toFixed(2)}%` }}
                ></div>
              </div>
              
              <p className="text-sm font-medium text-right mt-1">
                {((latestMeasurement.allocatedSpace / latestMeasurement.totalSpace) * 100).toFixed(2)}% utilizado
              </p>
            
              {/* Status da meta - só exibir se houver medições e dados de meta */}
              {goalResult && (
                <div className="mt-3">
                  <GoalStatus 
                    achieved={goalResult.achieved}
                    message={goalResult.message}
                    percentage={parseFloat(((latestMeasurement.allocatedSpace / latestMeasurement.totalSpace) * 100).toFixed(2))}
                    goalPercentage={goalResult.goalPercentage}
                    isMinimum={goalResult.isMinimum}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 p-5 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-500 mb-3">
                Sem medições registradas. Adicione uma medição para ver o progresso.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                onClick={() => onAddMeasurement(space)}
              >
                Adicionar Primeira Medição
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SpaceCard.propTypes = {
  space: PropTypes.object.isRequired,
  storeTypes: PropTypes.array.isRequired,
  goalResult: PropTypes.object,
  onAddMeasurement: PropTypes.func.isRequired,
  calculateUsedPercentage: PropTypes.func.isRequired,
};

export default SpaceCard;