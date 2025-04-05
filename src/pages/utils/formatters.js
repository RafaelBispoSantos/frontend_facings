/**
 * Funções utilitárias para formatação de dados
 */

// Formatar data
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  // Formatar moeda (caso necessário para alguma funcionalidade futura)
  export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formatar porcentagem
  export const formatPercentage = (value, decimals = 2) => {
    if (value === null || value === undefined) return '';
    return `${parseFloat(value).toFixed(decimals)}%`;
  };
  
  // Capitalizar primeira letra
  export const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Formatar nome da categoria para exibição
  export const formatCategoryName = (name) => {
    if (!name) return '';
    
    // Mapeamento de nomes internos para nomes de exibição (se necessário)
    const displayNames = {
      'Maionese': 'Maionese',
      'Desodorante': 'Desodorantes',
      'Sabonetes': 'Sabonetes',
      'Amaciantes': 'Amaciantes',
      'Detergente Líquido': 'Detergentes Líquidos',
      'Detergente em Pó': 'Detergentes em Pó',
      'Cabelos': 'Produtos para Cabelo'
    };
    
    return displayNames[name] || capitalize(name);
  };
  
  // Formatar tipo de loja para exibição
  export const formatStoreType = (type) => {
    if (!type) return '';
    
    const displayNames = {
      'atacarejo': 'Atacarejo',
      'varejo': 'Varejo',
      'contasGlobais': 'Contas Globais'
    };
    
    return displayNames[type] || capitalize(type);
  };