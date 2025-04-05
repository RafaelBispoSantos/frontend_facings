import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    this.setState({
      error,
      errorInfo
    });
    
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-lg font-medium text-red-800 mb-2">Algo deu errado</h2>
          <p className="text-red-700 mb-4">
            Ocorreu um erro ao renderizar este componente.
          </p>
          {this.state.error && (
            <div className="bg-white p-4 rounded border border-red-100 mb-4 overflow-auto max-h-40">
              <p className="font-mono text-sm text-red-600">
                {this.state.error.toString()}
              </p>
            </div>
          )}
          <Button onClick={this.handleReset} variant="primary">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func
};

export default ErrorBoundary;