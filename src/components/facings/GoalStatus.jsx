import React from 'react';
import PropTypes from 'prop-types';

const GoalStatus = ({ achieved, message, percentage, goalPercentage, isMinimum }) => {
  return (
    <div className={achieved ? 'goal-achieved' : 'goal-failed'}>
      <p className="font-medium">
        {achieved ? '✓ Meta atingida!' : '✗ Meta não atingida'}
      </p>
      <p className="text-sm mt-1">
        {message || (isMinimum 
          ? `${percentage}% atingido (mínimo: ${goalPercentage}%)` 
          : `${percentage}% atingido (máximo: ${goalPercentage}%)`
        )}
      </p>
    </div>
  );
};

GoalStatus.propTypes = {
  achieved: PropTypes.bool.isRequired,
  message: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  goalPercentage: PropTypes.number.isRequired,
  isMinimum: PropTypes.bool,
};

export default GoalStatus;