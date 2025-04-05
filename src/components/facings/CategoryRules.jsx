import React from 'react';
import PropTypes from 'prop-types';

const CategoryRules = ({ category, storeType, rule }) => {
  if (!category || !storeType) {
    return null;
  }
  
  // Renderização quando não há regras definidas
  if (!rule || (!rule.minimumPercentage && !rule.maximumPercentage)) {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded">
        <p className="font-medium text-yellow-800">
          Informações da categoria:
        </p>
        <p className="text-sm text-yellow-700">
          Não há regras específicas definidas para {category} em {storeType}.
        </p>
      </div>
    );
  }
  
  // Renderização para regras definidas
  return (
    <div className="p-3 bg-blue-50 border border-blue-100 rounded">
      <p className="font-medium text-blue-800">
        Regra para {category} em {storeType}:
      </p>
      <p className="text-sm text-blue-700 mt-1">
        {rule.description || (rule.minimumPercentage 
          ? `Deve representar no mínimo ${rule.minimumPercentage}% do espaço total` 
          : `Deve representar no máximo ${rule.maximumPercentage}% do espaço total`
        )}
      </p>
    </div>
  );
};

CategoryRules.propTypes = {
  category: PropTypes.string,
  storeType: PropTypes.string,
  rule: PropTypes.object
};

export default CategoryRules;