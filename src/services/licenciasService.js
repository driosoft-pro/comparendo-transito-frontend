import apiClient from "./apiClient.js";

const base = "/licencias";

/**
 * Normaliza la respuesta del backend para listas de licencias.
 * Soporta:
 * - [ {...}, {...} ]
 * - { licencias: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { licencias: [ ... ] } }
 */
const extractLicenciasList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.licencias)) return data.licencias;
  if (Array.isArray(data?.data?.licencias)) return data.data.licencias;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza la respuesta del backend para una sola licencia.
 * Soporta:
 * - { ...licencia }
 * - { licencia: { ... } }
 * - { data: { ... } }
 * - { data: { licencia: { ... } } }
 */
const extractLicencia = (data) => {
  if (!data) return {};
  if (data.licencia) return data.licencia;
  if (data.data?.licencia) return data.data.licencia;
  if (data.data) return data.data;
  return data || {};
};

export const getLicencias = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractLicenciasList(data);
};

export const getLicenciaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractLicencia(data);
};

export const createLicencia = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractLicencia(data);
};

export const updateLicencia = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractLicencia(data);
};

export const deleteLicencia = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
