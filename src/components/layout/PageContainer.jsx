import React from 'react';
import PropTypes from 'prop-types';
import Footer from './Footer';

const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer/>
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageContainer;