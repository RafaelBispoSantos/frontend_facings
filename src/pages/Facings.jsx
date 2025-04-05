import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Facings = () => {
  // Estados principais
  const [spaces, setSpaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeTypes, setStoreTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [goalResults, setGoalResults] = useState({});
  
  // Formulário de adição de espaço
  const [spaceName, setSpaceName] = useState('');
  const [totalSpace, setTotalSpace] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStoreType, setSelectedStoreType] = useState('');
  
  // Formulário de medição
  const [productType, setProductType] = useState('');
  const [allocatedSpace, setAllocatedSpace] = useState('');
  
  const navigate = useNavigate();
  const addFormRef = useRef(null);
  
  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Carregar categorias
        const categoriesResponse = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(categoriesResponse.data);
        
        // Carregar tipos de loja
        const storeTypesResponse = await axios.get('/api/store-types', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStoreTypes(storeTypesResponse.data);
        
        // Carregar espaços
        const spacesResponse = await axios.get('/api/spaces', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpaces(spacesResponse.data);
        
        // Carregar metas para cada espaço
        const results = {};
        for (const space of spacesResponse.data) {
          try {
            const goalResponse = await axios.get(`/api/spaces/${space._id}/check-goal`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            results[space._id] = goalResponse.data;
          } catch (err) {
            console.error(`Erro ao verificar meta para espaço ${space._id}:`, err);
          }
        }
        setGoalResults(results);
        
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Toggle para o formulário de adição de espaço
  const toggleAddForm = useCallback(() => {
    console.log("Toggle Add Form: Mudando de", showAddForm, "para", !showAddForm);
    setShowAddForm(prevState => !prevState);
  }, [showAddForm]);
  
  // Log do estado atual - ajuda a verificar quando o estado muda
  useEffect(() => {
    console.log("Estado showAddForm atualizado:", showAddForm);
  }, [showAddForm]);
  
  // Adicionar novo espaço
  const handleAddSpace = async (e) => {
    e.preventDefault();
    console.log("Formulário de adição enviado");
    try {
      const token = localStorage.getItem('token');
      console.log("Enviando dados:", { 
        name: spaceName, 
        totalSpace: parseFloat(totalSpace),
        categoryId: selectedCategory,
        storeType: selectedStoreType
      });
      
      const response = await axios.post('/api/spaces', 
        { 
          name: spaceName, 
          totalSpace: parseFloat(totalSpace),
          categoryId: selectedCategory,
          storeType: selectedStoreType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Resposta da API:", response.data);
      
      // Verificar meta para o novo espaço
      const goalResponse = await axios.get(`/api/spaces/${response.data._id}/check-goal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSpaces([...spaces, response.data]);
      setGoalResults({
        ...goalResults,
        [response.data._id]: goalResponse.data
      });
      
      // Limpar formulário
      setSpaceName('');
      setTotalSpace('');
      setSelectedCategory('');
      setSelectedStoreType('');
      setShowAddForm(false);
    } catch (err) {
      setError('Erro ao adicionar espaço');
      console.error("Erro detalhado:", err);
    }
  };
  
  // Adicionar medição
  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/spaces/${selectedSpace._id}/measurements`, 
        { 
          productType, 
          allocatedSpace: parseFloat(allocatedSpace) 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Verificar meta após adicionar medição
      const goalResponse = await axios.get(`/api/spaces/${selectedSpace._id}/check-goal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar o espaço na lista
      const updatedSpaces = spaces.map(space => 
        space._id === selectedSpace._id ? response.data : space
      );
      
      setSpaces(updatedSpaces);
      setGoalResults({
        ...goalResults,
        [selectedSpace._id]: goalResponse.data
      });
      
      setProductType('');
      setAllocatedSpace('');
      setShowMeasureForm(false);
      setSelectedSpace(null);
    } catch (err) {
      setError('Erro ao adicionar medição');
      console.error(err);
    }
  };
  
  // Excluir medição
  const handleDeleteMeasurement = async (spaceId, measurementId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/spaces/${spaceId}/measurements/${measurementId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Verificar meta após excluir medição
      const goalResponse = await axios.get(`/api/spaces/${spaceId}/check-goal`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualizar o espaço na lista
      const updatedSpaces = spaces.map(space => 
        space._id === spaceId ? response.data : space
      );
      
      setSpaces(updatedSpaces);
      setGoalResults({
        ...goalResults,
        [spaceId]: goalResponse.data
      });
    } catch (err) {
      setError('Erro ao excluir medição');
      console.error(err);
    }
  };
  
  // Calcular porcentagem utilizada
  const calculateUsedPercentage = (space) => {
    if (!space.measurements || space.measurements.length === 0) return 0;
    
    const totalAllocated = space.measurements.reduce((sum, measurement) => 
      sum + measurement.allocatedSpace, 0
    );
    
    return ((totalAllocated / space.totalSpace) * 100).toFixed(2);
  };
  
  // Obter mensagem de regra para o espaço selecionado
  const getRuleMessage = (space) => {
    if (!space || !space.category || !space.storeType) return '';
    
    const ruleKey = space.storeType;
    const rule = space.category.rules[ruleKey];
    
    return rule?.description || 'Sem regra definida para esta combinação';
  };
  
  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  if (isLoading) return <div className="text-center p-8">Carregando...</div>;
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Sistema de Medição de Facings</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* SOLUÇÃO DO BOTÃO - VÁRIAS ABORDAGENS */}
        
        {/* ABORDAGEM 1: Botão direto com área expandida para facilitar o clique */}
        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="mb-2 font-bold">Clique no botão abaixo para adicionar um novo espaço:</p>
          <button 
            type="button"
            id="addSpaceButton"
            onClick={(e) => {
              console.log("Botão Adicionar Espaço clicado");
              setShowAddForm(!showAddForm);
            }}
            className="w-full px-4 py-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg font-bold"
          >
            {showAddForm ? 'Cancelar' : 'Adicionar Novo Espaço'}
          </button>
        </div>
        
        {/* ABORDAGEM 2: Botão alternativo case o principal não funcione */}
        {!showAddForm && (
          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-700">Se o botão acima não funcionar, tente este:</p>
            <button 
              type="button"
              onClick={() => {
                console.log("Botão alternativo clicado");
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Abrir Formulário
            </button>
          </div>
        )}
        
        {/* Exibição explícita do estado atual */}
        <div className="mb-4 p-2 bg-gray-200 rounded">
          <p>Estado atual do formulário: {showAddForm ? 'Visível' : 'Oculto'}</p>
        </div>
        
        {/* Formulário para adicionar espaço */}
        {showAddForm && (
          <div ref={addFormRef} className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-blue-500">
            <h2 className="text-lg font-medium mb-4">Adicionar Novo Espaço</h2>
            <form 
              onSubmit={(e) => {
                console.log("Submit do formulário acionado");
                handleAddSpace(e);
              }}
            >
              <div className="mb-4">
                <label htmlFor="spaceName" className="block text-gray-700 text-sm font-bold mb-2">
                  Nome do Espaço
                </label>
                <input
                  type="text"
                  id="spaceName"
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="totalSpace" className="block text-gray-700 text-sm font-bold mb-2">
                  Espaço Total (cm)
                </label>
                <input
                  type="number"
                  id="totalSpace"
                  value={totalSpace}
                  onChange={(e) => setTotalSpace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Categoria
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="storeType" className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Loja
                </label>
                <select
                  id="storeType"
                  value={selectedStoreType}
                  onChange={(e) => setSelectedStoreType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione um tipo de loja</option>
                  {storeTypes.map(storeType => (
                    <option key={storeType._id} value={storeType.name}>
                      {storeType.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-bold"
                >
                  Salvar Espaço
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Formulário para adicionar medição */}
        {showMeasureForm && selectedSpace && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-medium mb-4">
              Adicionar Medição para: {selectedSpace.name}
            </h2>
            
            {/* Mostrar a regra aplicável */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-800">
                Regra aplicável para {selectedSpace.category.name} em {
                  storeTypes.find(st => st.name === selectedSpace.storeType)?.description || selectedSpace.storeType
                }:
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {getRuleMessage(selectedSpace)}
              </p>
            </div>
            
            <form onSubmit={(e) => handleAddMeasurement(e)}>
              <div className="mb-4">
                <label htmlFor="productType" className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Produto
                </label>
                <input
                  type="text"
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="allocatedSpace" className="block text-gray-700 text-sm font-bold mb-2">
                  Espaço Alocado (cm)
                </label>
                <input
                  type="number"
                  id="allocatedSpace"
                  value={allocatedSpace}
                  onChange={(e) => setAllocatedSpace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0.01"
                  max={selectedSpace.totalSpace}
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Espaço total disponível: {selectedSpace.totalSpace} cm
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Salvar Medição
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowMeasureForm(false);
                    setSelectedSpace(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Lista de espaços */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Espaços Cadastrados
            </h3>
          </div>
          
          {spaces.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum espaço cadastrado. Adicione um novo espaço para começar.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {spaces.map(space => (
                <li key={space._id} className="p-4">
                  <div className="mb-2 flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold">{space.name}</h4>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Categoria:</span> {space.category?.name || 'N/A'} | 
                        <span className="font-medium"> Tipo de Loja:</span> {
                          storeTypes.find(st => st.name === space.storeType)?.description || space.storeType
                        }
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSpace(space);
                        setShowMeasureForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Adicionar Medição
                    </button>
                  </div>
                  
                  {/* Regra aplicável */}
                  <div className="mb-2 text-sm">
                    <p className="font-medium">Regra aplicável:</p>
                    <p>{getRuleMessage(space)}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Espaço Total: {space.totalSpace} cm
                    </p>
                    
                    {/* Barra de progresso */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${calculateUsedPercentage(space)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {calculateUsedPercentage(space)}% utilizado
                    </p>
                  </div>
                  
                  {/* Status da meta */}
                  {goalResults[space._id] && (
                    <div className={`p-3 rounded mb-3 ${
                      goalResults[space._id].achieved ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                    }`}>
                      <p className={`font-medium ${
                        goalResults[space._id].achieved ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {goalResults[space._id].achieved ? '✓ Meta atingida!' : '✗ Meta não atingida'}
                      </p>
                      <p className={`text-sm ${
                        goalResults[space._id].achieved ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {goalResults[space._id].message}
                      </p>
                    </div>
                  )}
                  
                  {/* Lista de medições */}
                  {space.measurements && space.measurements.length > 0 ? (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Medições:</h5>
                      <div className="bg-gray-50 rounded p-3">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Produto
                              </th>
                              <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Espaço (cm)
                              </th>
                              <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                % do Total
                              </th>
                              <th className="px-2 py-1 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {space.measurements.map((measurement) => (
                              <tr key={measurement._id}>
                                <td className="px-2 py-2 text-sm text-gray-900">
                                  {measurement.productType}
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-900 text-right">
                                  {measurement.allocatedSpace}
                                </td>
                                <td className="px-2 py-2 text-sm text-gray-900 text-right">
                                  {((measurement.allocatedSpace / space.totalSpace) * 100).toFixed(2)}%
                                </td>
                                <td className="px-2 py-2 text-sm text-right">
                                  <button
                                    onClick={() => handleDeleteMeasurement(space._id, measurement._id)}
                                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Excluir
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Sem medições registradas
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Facings;