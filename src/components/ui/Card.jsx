import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 ${headerClassName}`}>
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      
      <div className={`p-6 ${bodyClassName}`}>{children}</div>
      
      {footer && (
        <div className={`px-4 py-4 sm:px-6 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  footer: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string
};

export default Card;