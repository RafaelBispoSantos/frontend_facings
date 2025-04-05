import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  id,
  name,
  value,
  onChange,
  children,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  // Classes base modernas
  const baseClasses = 'block w-full rounded-lg border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 transition-colors';
  
  // Classes condicionais
  const errorClasses = error 
    ? 'border-red-300 text-red-900 focus:ring-red-200 focus:border-red-500' 
    : '';
    
  const disabledClasses = disabled 
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-75' 
    : '';
  
  // Combinar todas as classes
  const classes = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`.trim();
  
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={classes}
        {...props}
      >
        {children}
      </select>
      
      {/* Ícone de seta customizado para dropdown */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg 
          className="fill-current h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </div>
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string
};

export default Select;