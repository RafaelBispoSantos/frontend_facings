/**
 * Funções de validação para formulários
 */

// Validar email
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validar senha (pelo menos 6 caracteres)
  export const isValidPassword = (password) => {
    return password && password.length >= 6;
  };
  
  // Validar se o campo está preenchido
  export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };
  
  // Validar se é um número positivo
  export const isPositiveNumber = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
  };
  
  // Validar se o espaço alocado não excede o total
  export const isValidAllocatedSpace = (allocatedSpace, totalSpace, currentlyUsed = 0) => {
    const space = parseFloat(allocatedSpace);
    
    if (isNaN(space) || space <= 0) {
      return false;
    }
    
    return (currentlyUsed + space) <= totalSpace;
  };
  
  // Validar formulário de espaço
  export const validateSpaceForm = (formData) => {
    const errors = {};
    
    if (!isNotEmpty(formData.name)) {
      errors.name = 'Nome do espaço é obrigatório';
    }
    
    if (!isNotEmpty(formData.totalSpace)) {
      errors.totalSpace = 'Espaço total é obrigatório';
    } else if (!isPositiveNumber(formData.totalSpace)) {
      errors.totalSpace = 'Espaço total deve ser um número positivo';
    }
    
    if (!isNotEmpty(formData.categoryId)) {
      errors.categoryId = 'Categoria é obrigatória';
    }
    
    if (!isNotEmpty(formData.storeType)) {
      errors.storeType = 'Tipo de loja é obrigatório';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Validar formulário de medição
  export const validateMeasurementForm = (formData, space) => {
    const errors = {};
    
    if (!isNotEmpty(formData.productType)) {
      errors.productType = 'Tipo de produto é obrigatório';
    }
    
    if (!isNotEmpty(formData.allocatedSpace)) {
      errors.allocatedSpace = 'Espaço alocado é obrigatório';
    } else if (!isPositiveNumber(formData.allocatedSpace)) {
      errors.allocatedSpace = 'Espaço alocado deve ser um número positivo';
    } else {
      // Calcular espaço total já utilizado
      const currentlyUsed = space.measurements.reduce(
        (sum, measurement) => sum + measurement.allocatedSpace, 0
      );
      
      if (!isValidAllocatedSpace(formData.allocatedSpace, space.totalSpace, currentlyUsed)) {
        const remaining = (space.totalSpace - currentlyUsed).toFixed(2);
        errors.allocatedSpace = `Espaço excede o limite disponível. Restante: ${remaining} cm`;
      }
      if (!formData.totalSpace) {
        errors.totalSpace = 'Espaço total é obrigatório';
      } else if (parseFloat(formData.totalSpace) <= 0) {
        errors.totalSpace = 'Espaço total deve ser um número positivo';
      }
      
      // Validação adicional para garantir que allocatedSpace <= totalSpace
      if (parseFloat(formData.allocatedSpace) > parseFloat(formData.totalSpace)) {
        errors.allocatedSpace = 'Espaço alocado não pode ser maior que o espaço total';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  