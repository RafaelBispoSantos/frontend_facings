import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom'; // Adicione useNavigate
import { Button } from '../../components/ui';
import { SpaceCard } from '../../components/facings';
import { useFacings } from '../../components/hooks/useFacings';
import { useStoreTypes } from '../../components/hooks/useStoreTypes';
import { Header, PageContainer } from '../../components/layout';
import api from '../../services/api';

const FacingsList = () => {
   const navigate = useNavigate(); // Adicione este hook de navegação

   const {
      spaces,
      isLoading,
      error,
      fetchSpaces,
      calculateUsedPercentage,
      deleteSpace
   } = useFacings();

   const { storeTypes } = useStoreTypes();
   const [goalResults, setGoalResults] = useState({});

   // Carregar metas para cada espaço
   useEffect(() => {
     const loadGoalResults = async () => {
       const results = {};
       
       for (const space of spaces) {
         try {
           const response = await api.get(`/spaces/${space._id}/check-goal`);
           results[space._id] = response.data;
         } catch (error) {
           console.error(`Erro ao verificar meta para espaço ${space._id}:`, error);
         }
       }
       
       setGoalResults(results);
     };
     
     if (spaces.length > 0) {
       loadGoalResults();
     }
   }, [spaces]);
   const handleAddFacing = () => {
    navigate('/facings/add');
  };
   // Manipulador para abrir página de medição
   const handleAddMeasurement = (space) => {
     navigate(`/facings/${space._id}/add-measurement`); // Use navigate
   };

   // Manipulador para excluir espaço
   const handleDeleteSpace = async (spaceId) => {
     if (window.confirm('Tem certeza que deseja excluir este espaço?')) {
       try {
         await deleteSpace(spaceId);
       } catch (error) {
         console.error('Erro ao excluir espaço:', error);
       }
     }
   };

   if (isLoading) {
     return (
       <PageContainer>
         <div className="text-center p-8">Carregando...</div>
       </PageContainer>
     );
   }

   return (
     <PageContainer>
       <Header title="Espaços de Facing" />
       
       {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
           {error}
         </div>
       )}
       
       <div className="mb-6 flex justify-between items-center">
         <Button
           onClick={handleAddFacing}
           variant="primary"
         >
           Adicionar Novo Espaço
         </Button>
         
         <Button
           variant="outline"
           onClick={() => fetchSpaces()}
         >
           Atualizar
         </Button>
       </div>
       
       {spaces.length === 0 ? (
         <div className="bg-white rounded-lg shadow p-8 text-center">
           <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum espaço cadastrado</h3>
           <p className="text-gray-500 mb-4">
             Adicione um novo espaço para começar a registrar medições de facing.
           </p>
           <Button
             handleAddFacing
             variant="primary"
           >
             Adicionar Primeiro Espaço
           </Button>
         </div>
       ) : (
         <div className="grid grid-cols-1 gap-6">
           {spaces.map(space => (
             <SpaceCard
               key={space._id}
               space={space}
               storeTypes={storeTypes}
               goalResult={goalResults[space._id]}
               onAddMeasurement={handleAddMeasurement}
               calculateUsedPercentage={calculateUsedPercentage}
               onDelete={() => handleDeleteSpace(space._id)}
             />
           ))}
         </div>
       )}
     </PageContainer>
   );
};

export default FacingsList;