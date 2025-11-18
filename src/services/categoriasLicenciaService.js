import apiClient from "./apiClient.js";

const base = "/categorias-licencia";

/**
 * Normaliza la respuesta del backend para listas de categorías de licencia.
 * Soporta:
 * - [ {...}, {...} ]
 * - { categorias: [ ... ] }
 * - { categorias_licencia: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { categorias: [ ... ] } }
 * - { data: { categorias_licencia: [ ... ] } }
 */
const extractCategoriasList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categorias)) return data.categorias;
  if (Array.isArray(data?.categorias_licencia)) return data.categorias_licencia;
  if (Array.isArray(data?.data?.categorias)) return data.data.categorias;
  if (Array.isArray(data?.data?.categorias_licencia))
    return data.data.categorias_licencia;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza la respuesta del backend para una sola categoría de licencia.
 * Soporta:
 * - { ...categoria }
 * - { categoria: { ... } }
 * - { categoria_licencia: { ... } }
 * - { data: { ... } }
 * - { data: { categoria: { ... } } }
 * - { data: { categoria_licencia: { ... } } }
 */
const extractCategoria = (data) => {
  if (!data) return {};
  if (data.categoria) return data.categoria;
  if (data.categoria_licencia) return data.categoria_licencia;
  if (data.data?.categoria) return data.data.categoria;
  if (data.data?.categoria_licencia) return data.data.categoria_licencia;
  if (data.data) return data.data;
  return data || {};
};

export const getCategoriasLicencia = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractCategoriasList(data);
};

export const getCategoriaLicenciaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractCategoria(data);
};

export const createCategoriaLicencia = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractCategoria(data);
};

export const updateCategoriaLicencia = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractCategoria(data);
};

export const deleteCategoriaLicencia = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
