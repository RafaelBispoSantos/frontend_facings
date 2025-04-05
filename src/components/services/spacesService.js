import api from "../../services/api";

const spacesService = {
  // Obter todos os espaços
  getAll: () => {
    return api.get('/spaces');
  },
  
  // Obter um espaço específico
  getById: (id) => {
    return api.get(`/spaces/${id}`);
  },
  
  // Criar um novo espaço
  create: (spaceData) => {
    return api.post('/spaces', spaceData);
  },
  
  // Atualizar um espaço
  update: (id, spaceData) => {
    return api.put(`/spaces/${id}`, spaceData);
  },
  
  // Excluir um espaço
  remove: (id) => {
    return api.delete(`/spaces/${id}`);
  },
  
  // Adicionar medição
  addMeasurement: (spaceId, measurementData) => {
    return api.post(`/spaces/${spaceId}/measurements`, measurementData);
  },
  
  // Excluir medição
  deleteMeasurement: (spaceId, measurementId) => {
    return api.delete(`/spaces/${spaceId}/measurements/${measurementId}`);
  },
  
  // Verificar meta
  checkGoal: (spaceId) => {
    return api.get(`/spaces/${spaceId}/check-goal`);
  }
};

export default spacesService;