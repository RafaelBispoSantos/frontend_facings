import React, { createContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

// Contexto inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Criar contexto
export const AuthContext = createContext(initialState);

// Tipos de ações
const AUTH_LOADING = 'AUTH_LOADING';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_ERROR = 'AUTH_ERROR';
const AUTH_LOGOUT = 'AUTH_LOGOUT';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS'; // Nova ação para registro bem-sucedido

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      };
    default:
      return state;
  }
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token ao carregar
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Opcional: verificar validade do token com o servidor
          // await authService.verifyToken();
          
          dispatch({
            type: AUTH_SUCCESS,
            payload: JSON.parse(userData)
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({
            type: AUTH_ERROR,
            payload: 'Sessão expirada. Faça login novamente.'
          });
        }
      } else {
        dispatch({
          type: AUTH_ERROR,
          payload: null
        });
      }
    };
    
    verifyAuth();
  }, []);

  // Função de login
  const login = async (email, password) => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: response.data.user
      });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response?.data?.message || 'Erro ao fazer login'
      });
      throw error;
    }
  };

  // Função de registro
  const register = async (userData) => {
    dispatch({ type: AUTH_LOADING });
    try {
      const response = await authService.register(userData);
      
      // Importante: despachar ação para indicar que o registro foi bem-sucedido
      dispatch({ type: REGISTER_SUCCESS });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error.response?.data?.message || 'Erro ao registrar'
      });
      throw error;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_LOGOUT });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};