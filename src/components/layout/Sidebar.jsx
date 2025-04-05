// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  // Verifica se a rota atual corresponde ao link
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Links da navegação
  const navLinks = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Facings',
      path: '/facings',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Relatórios',
      path: '/reports',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Configurações',
      path: '/settings',
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Classes para o sidebar
  const sidebarClasses = `bg-blue-700 text-white fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0 md:static md:inset-auto`;

  // Overlay para dispositivos móveis
  const overlayClasses = `fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity ${
    isOpen ? 'opacity-100 block' : 'opacity-0 hidden'
  } md:hidden`;

  return (
    <>
      {/* Sidebar para desktop e mobile */}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <h2 className="text-xl font-bold">Sistema de Facings</h2>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md text-white hover:bg-blue-800 md:hidden focus:outline-none"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <ul>
            {navLinks.map((link) => (
              <li key={link.path} className="mb-2">
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  {link.icon}
                  <span className="ml-3">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
          <Link 
            to="/profile" 
            className="flex items-center text-sm font-medium text-blue-100 hover:text-white"
          >
            <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center mr-3">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p>Usuário</p>
              <p className="text-xs text-blue-300">Ver perfil</p>
            </div>
          </Link>
        </div>
      </aside>
      
      {/* Overlay para fechar o sidebar em dispositivos móveis */}
      <div 
        className={overlayClasses} 
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

export default Sidebar;