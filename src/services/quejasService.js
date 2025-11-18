import apiClient from "./apiClient.js";

const base = "/quejas";

/**
 * Normaliza la respuesta del backend para listas de quejas.
 * Soporta:
 * - [ {...}, {...} ]
 * - { quejas: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { quejas: [ ... ] } }
 */
const extractQuejasList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.quejas)) return data.quejas;
  if (Array.isArray(data?.data?.quejas)) return data.data.quejas;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza la respuesta del backend para una sola queja.
 * Soporta:
 * - { ...queja }
 * - { queja: { ... } }
 * - { data: { ... } }
 * - { data: { queja: { ... } } }
 */
const extractQueja = (data) => {
  if (!data) return {};
  if (data.queja) return data.queja;
  if (data.data?.queja) return data.data.queja;
  if (data.data) return data.data;
  return data || {};
};

export const getQuejas = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractQuejasList(data);
};

export const getQuejaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractQueja(data);
};

export const createQueja = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractQueja(data);
};

export const updateQueja = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractQueja(data);
};

export const deleteQueja = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
