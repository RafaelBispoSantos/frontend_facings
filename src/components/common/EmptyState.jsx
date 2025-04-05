import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon = null
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node
};

export default EmptyState;