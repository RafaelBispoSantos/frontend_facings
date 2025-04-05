/**
 * Cálculos relacionados a facings e métricas
 */

// Calcula a porcentagem utilizada do espaço total
export const calculateUsedPercentage = (space) => {
    if (!space || !space.measurements || space.measurements.length === 0) {
      return 0;
    }
    
    const totalAllocated = space.measurements.reduce(
      (sum, measurement) => sum + measurement.allocatedSpace, 0
    );
    
    return parseFloat(((totalAllocated / space.totalSpace) * 100).toFixed(2));
  };
  
  // Verifica se a meta foi atingida com base na regra
  export const checkGoalAchieved = (percentage, rule) => {
    if (!rule) return false;
    
    if (rule.minimumPercentage !== null) {
      return percentage >= rule.minimumPercentage;
    }
    
    if (rule.maximumPercentage !== null) {
      return percentage <= rule.maximumPercentage;
    }
    
    return false;
  };
  
  // Gera mensagem de status da meta
  export const generateGoalStatusMessage = (percentage, rule) => {
    if (!rule) return 'Sem regra definida';
    
    const achieved = checkGoalAchieved(percentage, rule);
    const formattedPercentage = percentage.toFixed(2);
    
    if (rule.minimumPercentage !== null) {
      return achieved 
        ? `Meta atingida! (${formattedPercentage}% ≥ ${rule.minimumPercentage}%)`
        : `Meta não atingida. (${formattedPercentage}% < ${rule.minimumPercentage}%)`;
    }
    
    if (rule.maximumPercentage !== null) {
      return achieved 
        ? `Meta atingida! (${formattedPercentage}% ≤ ${rule.maximumPercentage}%)`
        : `Meta não atingida. (${formattedPercentage}% > ${rule.maximumPercentage}%)`;
    }
    
    return 'Sem meta definida';
  };
  
  // Calcula o espaço restante disponível
  export const calculateRemainingSpace = (space) => {
    if (!space) return 0;
    
    const usedSpace = space.measurements.reduce(
      (sum, measurement) => sum + measurement.allocatedSpace, 0
    );
    
    return parseFloat((space.totalSpace - usedSpace).toFixed(2));
  };
  
  // Calcula a contribuição percentual de cada produto
  export const calculateProductContribution = (measurement, totalSpace) => {
    if (!measurement || !totalSpace) return 0;
    return parseFloat(((measurement.allocatedSpace / totalSpace) * 100).toFixed(2));
  };
  