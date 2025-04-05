import React from 'react';
import PropTypes from 'prop-types';

const SpaceProgressBar = ({ 
  percentage, 
  goalPercentage, 
  isMinimum = true, 
  achieved = false 
}) => {
  // Determinar a cor da barra com base no status
  const getBarColor = () => {
    if (achieved) return 'bg-green-500';
    if (!achieved) return 'bg-red-500';
    return 'bg-blue-500'; // Cor padrão
  };
  
  // Determinar a largura da barra
  const barWidth = `${percentage}%`;
  
  // Determinar a posição do marcador de meta
  const goalPosition = `${goalPercentage}%`;
  
  return (
    <div className="mt-2 mb-1">
      <div className="progress-bar-bg relative">
        {/* Barra de progresso */}
        <div 
          className={`progress-bar ${getBarColor()}`} 
          style={{ width: barWidth }}
        ></div>
        
        {/* Marcador de meta */}
        <div 
          className={`absolute top-0 bottom-0 w-0.5 ${isMinimum ? 'bg-green-700' : 'bg-red-700'}`} 
          style={{ left: goalPosition }}
        >
          <div className={`absolute -top-5 -ml-2 text-xs font-medium ${isMinimum ? 'text-green-700' : 'text-red-700'}`}>
            {goalPercentage}%
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

SpaceProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  goalPercentage: PropTypes.number.isRequired,
  isMinimum: PropTypes.bool,
  achieved: PropTypes.bool
};

export default SpaceProgressBar;