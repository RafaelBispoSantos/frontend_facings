import { useState, useEffect } from 'react';
import storeTypesService from '../../services/storeTypesService';

export const useStoreTypes = () => {
  const [storeTypes, setStoreTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStoreTypes = async () => {
      setIsLoading(true);
      try {
        const response = await storeTypesService.getAll();
        setStoreTypes(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar tipos de loja');
        console.error('Erro ao buscar tipos de loja:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreTypes();
  }, []);
  
  const getStoreTypeByName = (name) => {
    return storeTypes.find(storeType => storeType.name === name);
  };
  
  const getStoreTypeDescription = (name) => {
    const storeType = getStoreTypeByName(name);
    return storeType ? storeType.description : name;
  };
  
  return {
    storeTypes,
    isLoading,
    error,
    getStoreTypeByName,
    getStoreTypeDescription
  };
};
