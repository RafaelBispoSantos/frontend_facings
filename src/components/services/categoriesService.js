import api from"../../services/api";
const categoriesService = {
  // Obter todas as categorias
  getAll: () => {
    return api.get('/categories');
  },
  
  // Obter uma categoria específica
  getById: (id) => {
    return api.get(`/categories/${id}`);
  },
  
  // Obter regras para um tipo de loja específico
  getRulesByStoreType: (storeType) => {
    return api.get(`/categories/rules/${storeType}`);
  }
};

export default categoriesService;