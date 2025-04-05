import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ children, color = 'blue', size = 'md', rounded = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span className={`inline-flex items-center ${colorClasses[color] || colorClasses.blue} ${sizeClasses[size] || sizeClasses.md} ${roundedClasses} font-medium`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'gray', 'red', 'green', 'yellow', 'indigo', 'purple', 'pink']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool
};

export default Badge;