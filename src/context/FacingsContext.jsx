import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// Estado inicial
const initialState = {
  spaces: [],
  isLoading: true,
  error: null,
  selectedSpace: null
};

// Criar contexto
export const FacingsContext = createContext(initialState);

// Tipos de ações
const FACINGS_LOADING = 'FACINGS_LOADING';
const FACINGS_LOADED = 'FACINGS_LOADED';
const FACINGS_ERROR = 'FACINGS_ERROR';
const SPACE_SELECTED = 'SPACE_SELECTED';

// Reducer
const facingsReducer = (state, action) => {
  switch (action.type) {
    case FACINGS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FACINGS_LOADED:
      return {
        ...state,
        spaces: action.payload,
        isLoading: false,
        error: null
      };
    case FACINGS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case SPACE_SELECTED:
      return {
        ...state,
        selectedSpace: action.payload
      };
    default:
      return state;
  }
};

// Provider
export const FacingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(facingsReducer, initialState);
  
  // Carregar espaços (simulação)
  const fetchSpaces = useCallback(async () => {
    dispatch({ type: FACINGS_LOADING });
    try {
      // Aqui você faria uma chamada real para a API
      // Por enquanto, apenas simulamos
      const mockSpaces = [];
      
      setTimeout(() => {
        dispatch({ type: FACINGS_LOADED, payload: mockSpaces });
      }, 500);
    } catch (err) {
      dispatch({ 
        type: FACINGS_ERROR, 
        payload: 'Erro ao carregar espaços' 
      });
    }
  }, []);
  
  // Carregar espaços ao montar o componente
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);
  
  // Valor do contexto
  const contextValue = {
    ...state,
    fetchSpaces,
    // Outras funções serão implementadas posteriormente
  };
  
  return (
    <FacingsContext.Provider value={contextValue}>
      {children}
    </FacingsContext.Provider>
  );
};

FacingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};