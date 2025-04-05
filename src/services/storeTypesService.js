import api from './api';

const storeTypesService = {
  // Obter todos os tipos de loja
  getAll: () => {
    return api.get('/store-types');
  }
};

export default storeTypesService;
