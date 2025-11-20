import apiClient from "./apiClient.js";

const base = "/licencia-categorias";

/**
 * Normaliza lista de relaciones licencia-categoría.
 * Soporta:
 * - [ {...}, {...} ]
 * - { registros: [ ... ] }
 * - { licencias_categoria: [ ... ] }
 * - { licenciasCategoria: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { registros: [ ... ] } }
 */
const extractRelList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.registros)) return data.registros;
  if (Array.isArray(data?.licencias_categoria)) return data.licencias_categoria;
  if (Array.isArray(data?.licenciasCategoria)) return data.licenciasCategoria;
  if (Array.isArray(data?.data?.registros)) return data.data.registros;
  if (Array.isArray(data?.data?.licencias_categoria))
    return data.data.licencias_categoria;
  if (Array.isArray(data?.data?.licenciasCategoria))
    return data.data.licenciasCategoria;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza una sola relación licencia-categoría.
 */
const extractRel = (data) => {
  if (!data) return {};
  if (data.registro) return data.registro;
  if (data.licencia_categoria) return data.licencia_categoria;
  if (data.data?.registro) return data.data.registro;
  if (data.data?.licencia_categoria) return data.data.licencia_categoria;
  if (data.data) return data.data;
  return data;
};

export const getLicenciasCategoria = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractRelList(data);
};

export const createLicenciaCategoria = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractRel(data);
};

export const deleteLicenciaCategoria = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
