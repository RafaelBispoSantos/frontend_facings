import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Alert } from '../ui';

// Componente para uma única notificação
const Notification = ({ id, type, title, message, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);
  
  return (
    <div className="transform transition-all duration-300 ease-in-out">
      <Alert
        type={type}
        title={title}
        message={message}
        onClose={() => onClose(id)}
        className="mb-3 shadow-md"
      />
    </div>
  );
};

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

// Contexto para o sistema de notificações
const NotificationContext = React.createContext({
  addNotification: () => {},
  removeNotification: () => {}
});

// Provider para o sistema de notificações
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Adicionar uma nova notificação
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  }, []);
  
  // Remover uma notificação
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Renderizar as notificações
  const notificationsPortal = typeof document !== 'undefined' ? createPortal(
    <div className="fixed top-0 right-0 p-4 z-50 max-w-md w-full pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </div>,
    document.body
  ) : null;
  
  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {notificationsPortal}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Hook para usar o sistema de notificações
export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  
  return {
    notify: (type, message, title, duration = 5000) => {
      return context.addNotification({ type, message, title, duration });
    },
    success: (message, title, duration) => {
      return context.addNotification({ type: 'success', message, title, duration });
    },
    info: (message, title, duration) => {
      return context.addNotification({ type: 'info', message, title, duration });
    },
    warning: (message, title, duration) => {
      return context.addNotification({ type: 'warning', message, title, duration });
    },
    error: (message, title, duration) => {
      return context.addNotification({ type: 'error', message, title, duration });
    },
    remove: (id) => {
      context.removeNotification(id);
    }
  };
};
