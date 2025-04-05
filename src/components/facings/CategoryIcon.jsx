import React from 'react';
import PropTypes from 'prop-types';

// SVG Paths para os ícones de categoria
const CATEGORY_ICONS = {
  'Maionese': (
    <path d="M12 2C9.79 2 8 3.79 8 6v12c0 2.21 1.79 4 4 4s4-1.79 4-4V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v1h-4V6c0-1.1.9-2 2-2zm0 16c-1.1 0-2-.9-2-2v-5h4v5c0 1.1-.9 2-2 2zm-4-9h8V8h-8v3z" />
  ),
  'Desodorante': (
    <path d="M16 3h-2c0-1.1-.9-2-2-2s-2 .9-2 2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16H8V5h2v1c0 1.1.9 2 2 2s2-.9 2-2V5h2v14z" />
  ),
  'Sabonetes': (
    <path d="M17 5c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h10m0-2H7C5.35 3 4 4.35 4 6v12c0 1.65 1.35 3 3 3h10c1.65 0 3-1.35 3-3V6c0-1.65-1.35-3-3-3zm-4 14c2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3-1.66 0-3 1.34-3 3s1.34 3 3 3z" />
  ),
  'Amaciantes': (
    <path d="M18 4h-4c0-1.1-.9-2-2-2s-2 .9-2 2H6C4.9 4 4 4.9 4 6v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 12H6V6h2v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V6h2v10z" />
  ),
  'Detergente Líquido': (
    <path d="M16 2H8C6.9 2 6 2.9 6 4v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8v-1h8v1zm0-3H8V7h8v10zm0-12H8V4h8v1zM7 18c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2s2 .9 2 2v10c0 1.1-.9 2-2 2z" />
  ),
  'Detergente em Pó': (
    <path d="M8 5h2v3H8zm0 7h2v5H8zm10-9.99L6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-1.99-2-1.99zM18 20H6v-9.02h12V20zm0-11H6V4h12v5z" />
  ),
  'Cabelos': (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  ),
  'default': (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8s8 3.59 8 8c0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  )
};

const CategoryIcon = ({ category, className = '' }) => {
  const svgPath = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-6 w-6 ${className}`}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      {svgPath}
    </svg>
  );
};

CategoryIcon.propTypes = {
  category: PropTypes.string,
  className: PropTypes.string
};

export default CategoryIcon;