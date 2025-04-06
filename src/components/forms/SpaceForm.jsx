import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Select } from '../ui';
import { useCategories } from './../hooks/useCategories';
import { useStoreTypes } from './../hooks/useStoreTypes';

const SpaceForm = ({ onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    storeType: ''
  });
  
  const [errors, setErrors] = useState({});
  const { categories, isLoading: loadingCategories } = useCategories();
  const { storeTypes, isLoading: loadingStoreTypes } = useStoreTypes();
  
  // Preencher com dados iniciais se fornecidos
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        categoryId: initialData.category?._id || initialData.categoryId || '',
        storeType: initialData.storeType || ''
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro ao editar campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do espaço é obrigatório';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }
    
    if (!formData.storeType) {
      newErrors.storeType = 'Tipo de loja é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  if (loadingCategories || loadingStoreTypes) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Espaço
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Categoria Deos - Loja Assai Pirelli"
            error={errors.name}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <div className="relative">
            <Select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              error={errors.categoryId}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
        </div>
        
        <div>
          <label htmlFor="storeType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Loja
          </label>
          <div className="relative">
            <Select
              id="storeType"
              name="storeType"
              value={formData.storeType}
              onChange={handleChange}
              error={errors.storeType}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none pr-10"
            >
              <option value="">Selecione um tipo de loja</option>
              {storeTypes.map(storeType => (
                <option key={storeType._id} value={storeType.name}>
                  {storeType.description}
                </option>
              ))}
            </Select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          {errors.storeType && <p className="mt-1 text-xs text-red-600">{errors.storeType}</p>}
          
          <p className="mt-2 text-xs text-gray-500 italic">
            O tipo de loja determina quais regras serão aplicadas às medições deste espaço.
          </p>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            {isSubmitting 
              ? 'Processando...' 
              : initialData 
                ? 'Atualizar Espaço' 
                : 'Adicionar Espaço'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

SpaceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isSubmitting: PropTypes.bool
};

export default SpaceForm;