import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, PageContainer } from '../../components/layout';
import { SpaceForm } from '../../components/forms';
import { Button } from '../../components/ui';
import { useFacings } from '../../components/hooks/useFacings';

const AddSpace = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { createSpace } = useFacings();
  const navigate = useNavigate();
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newSpace = await createSpace(formData);
      // Redirecionar para a lista de espaços após sucesso
      navigate('/facings');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar espaço');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageContainer>
      <Header title="Adicionar Novo Espaço" />
      
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
        <h2 className="text-lg font-medium mb-4">Dados do Espaço</h2>
        <SpaceForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </PageContainer>
  );
};

export default AddSpace;