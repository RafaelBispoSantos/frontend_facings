import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Input } from "../ui";
import { CategoryRules } from "../facings";

const MeasurementForm = ({
  space,
  onSubmit,
  isSubmitting = false,
  storeTypes = [],
}) => {
  const [formData, setFormData] = useState({
    productType: "",
    totalSpace: "", 
    allocatedSpace: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro ao editar campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productType.trim()) {
      newErrors.productType = "Tipo de produto é obrigatório";
    }

    if (!formData.allocatedSpace) {
      newErrors.allocatedSpace = "Espaço alocado é obrigatório";
    } else if (parseFloat(formData.allocatedSpace) <= 0) {
      newErrors.allocatedSpace = "Espaço alocado deve ser maior que zero";
    } else if (parseFloat(formData.allocatedSpace) > space.totalSpace) {
      newErrors.allocatedSpace = `Espaço alocado não pode ser maior que o espaço total (${space.totalSpace} cm)`;
    }

    // Verificar se o espaço total já utilizado + novo espaço excede o total disponível
    const currentlyUsed = space.measurements.reduce(
      (sum, measurement) => sum + measurement.allocatedSpace,
      0
    );

    if (
      currentlyUsed + parseFloat(formData.allocatedSpace) >
      space.totalSpace
    ) {
      newErrors.allocatedSpace = `Espaço excede o limite disponível. Restante: ${(space.totalSpace - currentlyUsed).toFixed(2)} cm`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Converter para número
      const formattedData = {
        ...formData,
        allocatedSpace: parseFloat(formData.allocatedSpace),
      };

      onSubmit(formattedData);
    }
  };

  // Obter a regra aplicável para este espaço
  const getApplicableRule = () => {
    if (!space || !space.category || !space.storeType) {
      return null;
    }

    return space.category.rules?.[space.storeType];
  };

  // Obter o nome do tipo de loja para exibição
  const getStoreTypeName = () => {
    if (!space || !space.storeType) return space?.storeType || "";

    const storeType = storeTypes.find((st) => st.name === space.storeType);
    return storeType?.description || space.storeType;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Mostrar informações da regra aplicável */}
      <div className="mb-6">
        <CategoryRules
          category={space.category?.name}
          storeType={getStoreTypeName()}
          rule={getApplicableRule()}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Produto
          </label>
          <Input
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            placeholder="Ex: Rexona Clinical"
            error={errors.productType}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.productType && (
            <p className="mt-1 text-xs text-red-600">{errors.productType}</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <label htmlFor="totalSpace" className="block text-sm font-medium text-gray-700 mb-1">
            Espaço Total da Categoria (cm)
          </label>
          <div className="relative">
            <input
              id="totalSpace"
              name="totalSpace"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.totalSpace}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-8"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">cm</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 italic">
            Espaço total disponível para toda a categoria 
          </p>
        </div>

        <div>
          <label htmlFor="allocatedSpace" className="block text-sm font-medium text-gray-700 mb-1">
            Espaço dos items a ser cauculado   (cm)
          </label>
          <div className="relative">
            <Input
              id="allocatedSpace"
              name="allocatedSpace"
              type="number"
              min="0.01"
              step="0.01"
              max={space.totalSpace}
              value={formData.allocatedSpace}
              onChange={handleChange}
              placeholder="Ex: 30"
              error={errors.allocatedSpace}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">cm</span>
            </div>
          </div>
          {errors.allocatedSpace && (
            <p className="mt-1 text-xs text-red-600">{errors.allocatedSpace}</p>
          )}

          <div className="mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-600">
              Espaço total disponível: <span className="font-medium">{space.totalSpace} cm</span>
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            {isSubmitting ? "Processando..." : "Adicionar Medição"}
          </Button>
        </div>
      </form>
    </div>
  );
};

MeasurementForm.propTypes = {
  space: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  storeTypes: PropTypes.array,
};

export default MeasurementForm;