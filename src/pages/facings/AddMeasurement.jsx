import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, PageContainer } from '../../components/layout';
import { MeasurementForm } from '../../components/forms';
import { Button } from '../../components/ui';
import { useFacings } from '../../components/hooks/useFacings';
import { useStoreTypes } from '../../components/hooks/useStoreTypes';
import spacesService from '../../components/services/spacesService'; // Importe o serviço diretamente

const AddMeasurement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { addMeasurement } = useFacings();
  const { storeTypes } = useStoreTypes();
  
  // Carregar o espaço pelo ID - Modificado para evitar o loop
  useEffect(() => {
    const fetchSpace = async () => {
      setIsLoading(true);
      try {
        // Use o serviço diretamente em vez do hook
        const response = await spacesService.getById(id);
        setSpace(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar espaço');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpace();
  }, [id]); // Remova getSpaceById da lista de dependências
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addMeasurement(id, formData);
      // Redirecionar para a lista de espaços após sucesso
      navigate('/facings');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao adicionar medição');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center p-8">Carregando...</div>
      </PageContainer>
    );
  }
  
  if (!space && !isLoading) {
    return (
      <PageContainer>
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-gray-800 mb-2">Espaço não encontrado</h2>
          <p className="text-gray-600 mb-4">O espaço que você está tentando acessar não existe ou foi removido.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/facings')}
          >
            Voltar para Espaços
          </Button>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <Header title={`Adicionar Medição - ${space.name || 'Sem nome'}`} />
      
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/facings')}
        >
          ← Voltar para Espaços
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MeasurementForm
          space={space}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          storeTypes={storeTypes}
        />
      </div>
    </PageContainer>
  );
};

export default AddMeasurement;