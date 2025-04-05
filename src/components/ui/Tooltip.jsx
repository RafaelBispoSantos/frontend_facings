import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const targetRef = useRef(null);
  
  // Posições do tooltip
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };
  
  // Posições da seta
  const arrowPositions = {
    top: 'bottom-0 left-1/2 transform translate-x-[-50%] translate-y-[100%] border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-0 top-1/2 transform translate-x-[-100%] translate-y-[-50%] border-t-transparent border-b-transparent border-r-transparent',
    bottom: 'top-0 left-1/2 transform translate-x-[-50%] translate-y-[-100%] border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 transform translate-x-[100%] translate-y-[-50%] border-t-transparent border-b-transparent border-l-transparent'
  };
  
  // Mostrar/ocultar tooltip
  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      ref={targetRef}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-md shadow-sm ${positions[position]} ${className}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-gray-900 ${arrowPositions[position]}`}
          ></div>
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  className: PropTypes.string
};

export default Tooltip;