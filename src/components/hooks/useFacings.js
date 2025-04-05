import { useState, useEffect, useCallback } from 'react';
import spacesService from '../services/spacesService';

export const useFacings = () => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await spacesService.getAll();
      setSpaces(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar espaços');
      console.error('Erro ao buscar espaços:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);
  
  const getSpaceById = async (id) => {
    setIsLoading(true);
    try {
      const response = await spacesService.getById(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar espaço');
      console.error(`Erro ao buscar espaço ${id}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createSpace = async (spaceData) => {
    setIsLoading(true);
    try {
      const response = await spacesService.create(spaceData);
      setSpaces(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar espaço');
      console.error('Erro ao criar espaço:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateSpace = async (id, spaceData) => {
    setIsLoading(true);
    try {
      const response = await spacesService.update(id, spaceData);
      setSpaces(prev => prev.map(space => 
        space._id === id ? response.data : space
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar espaço');
      console.error(`Erro ao atualizar espaço ${id}:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteSpace = async (id) => {
    try {
      await spacesService.remove(id);
      setSpaces(prev => prev.filter(space => space._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir espaço');
      console.error(`Erro ao excluir espaço ${id}:`, err);
      throw err;
    }
  };
  
  const addMeasurement = async (spaceId, measurementData) => {
    try {
      console.log('Iniciando addMeasurement:', {
        spaceId,
        measurementData
      });

      const formattedData = {
        ...measurementData,
        totalSpace: parseFloat(measurementData.totalSpace),
        allocatedSpace: parseFloat(measurementData.allocatedSpace)
      };

      console.log('Dados formatados:', formattedData);

      const response = await spacesService.addMeasurement(spaceId, formattedData);
      
      console.log('Resposta da adição de medição:', response);

      setSpaces(prev => {
        const updatedSpaces = prev.map(space => 
          space._id === spaceId ? response.data : space
        );
        
        console.log('Espaços atualizados:', updatedSpaces);
        return updatedSpaces;
      });

      return response.data;
    } catch (err) {
      console.error('Erro detalhado na adição de medição:', {
        spaceId,
        measurementData,
        error: err,
        response: err.response,
        message: err.message
      });

      setError(err.response?.data?.message || 'Erro ao adicionar medição');
      throw err;
    }
  };
  
  const deleteMeasurement = async (spaceId, measurementId) => {
    try {
      const response = await spacesService.deleteMeasurement(spaceId, measurementId);
      setSpaces(prev => prev.map(space => 
        space._id === spaceId ? response.data : space
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao excluir medição');
      console.error(`Erro ao excluir medição ${measurementId} do espaço ${spaceId}:`, err);
      throw err;
    }
  };
  
  const checkGoal = async (spaceId) => {
    try {
      const response = await spacesService.checkGoal(spaceId);
      return response.data;
    } catch (err) {
      console.error(`Erro ao verificar meta para espaço ${spaceId}:`, err);
      throw err;
    }
  };
  
  // Funções utilitárias
  const calculateUsedPercentage = (space) => {
    if (!space.measurements || space.measurements.length === 0) return 0;
    
    const totalAllocated = space.measurements.reduce((sum, measurement) => 
      sum + measurement.allocatedSpace, 0
    );
    
    return ((totalAllocated / space.totalSpace) * 100).toFixed(2);
  };
  
  return {
    spaces,
    isLoading,
    error,
    fetchSpaces,
    getSpaceById,
    createSpace,
    updateSpace,
    deleteSpace,
    addMeasurement,
    deleteMeasurement,
    checkGoal,
    calculateUsedPercentage
  };
};