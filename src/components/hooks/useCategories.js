import { useState, useEffect } from 'react';
import categoriesService from '../services/categoriesService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesService.getAll();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar categorias');
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const getCategoryById = (id) => {
    return categories.find(category => category._id === id);
  };
  
  const getCategoryRules = (categoryId, storeType) => {
    const category = getCategoryById(categoryId);
    if (!category || !storeType) return null;
    
    return category.rules?.[storeType] || null;
  };
  
  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories,
    getCategoryById,
    getCategoryRules
  };
};