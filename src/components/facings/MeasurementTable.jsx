import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

const MeasurementTable = ({ 
  measurements = [], 
  totalSpace, 
  onDelete 
}) => {
  if (!measurements || measurements.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">
        Sem medições registradas
      </div>
    );
  }
  
  // Calcular porcentagem do espaço total
  const calculatePercentage =  (measurement) => {
    if (!measurement || !measurement.totalSpace) return 0;
    return ((measurement.allocatedSpace / measurement.totalSpace) * 100).toFixed(2);
  };
  // Formatação de data
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  return (
    <div className="bg-gray-50 rounded p-3">
      <h5 className="text-sm font-medium text-gray-700 mb-2">Medições:</h5>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Espaço (cm)
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % do Total
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {measurements.map((measurement) => (
              <tr key={measurement._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {measurement.productType}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 text-right whitespace-nowrap">
                  {measurement.allocatedSpace}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 text-right whitespace-nowrap">
                  {calculatePercentage(measurement.allocatedSpace)}%
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 text-center whitespace-nowrap">
                  {formatDate(measurement.createdAt)}
                </td>
                <td className="px-3 py-2 text-sm text-right whitespace-nowrap">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(measurement._id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 text-sm font-medium">Total</td>
              <td className="px-3 py-2 text-sm font-medium text-right">
                {measurements.reduce((sum, m) => sum + m.allocatedSpace, 0).toFixed(2)}
              </td>
              <td className="px-3 py-2 text-sm font-medium text-right">
                {calculatePercentage(measurements.reduce((sum, m) => sum + m.allocatedSpace, 0))}%
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

MeasurementTable.propTypes = {
  measurements: PropTypes.array,
  totalSpace: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default MeasurementTable;