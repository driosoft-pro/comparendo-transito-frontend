import apiClient from "./apiClient.js";

const base = "/comparendos";

/**
 * Normaliza la respuesta del backend para listas de comparendos.
 * Soporta:
 * - [ {...}, {...} ]
 * - { comparendos: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { comparendos: [ ... ] } }
 */
const extractComparendosList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.comparendos)) return data.comparendos;
  if (Array.isArray(data?.data?.comparendos)) return data.data.comparendos;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza la respuesta del backend para un solo comparendo.
 * Soporta:
 * - { ... }
 * - { comparendo: { ... } }
 * - { data: { ... } }
 * - { data: { comparendo: { ... } } }
 */
const extractComparendoItem = (data) => {
  if (!data) return null;
  if (data.comparendo) return data.comparendo;
  if (data.data?.comparendo) return data.data.comparendo;
  if (data.data) return data.data;
  return data;
};

export const getComparendos = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractComparendosList(data);
};

export const getComparendoById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractComparendoItem(data);
};

export const createComparendo = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractComparendoItem(data);
};

export const updateComparendo = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractComparendoItem(data);
};

export const deleteComparendo = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
