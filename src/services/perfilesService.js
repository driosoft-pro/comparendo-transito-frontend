import apiClient from "./apiClient.js";

const base = "/perfiles";

/**
 * Normaliza la respuesta del backend para listas de perfiles.
 * Soporta:
 * - [ {...}, {...} ]
 * - { perfiles: [ ... ] }
 * - { data: [ ... ] }
 */
const extractPerfilesList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.perfiles)) return data.perfiles;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza la respuesta del backend para un solo perfil.
 * Soporta:
 * - { ...perfil }
 * - { perfil: { ... } }
 * - { data: { ... } }
 */
const extractPerfil = (data) => {
  if (data?.perfil) return data.perfil;
  if (data?.data) return data.data;
  return data || {};
};

export const getPerfiles = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractPerfilesList(data);
};

export const getPerfilById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractPerfil(data);
};

export const getMiPerfil = async () => {
  const { data } = await apiClient.get(`${base}/me`);
  return extractPerfil(data);
};

export const createPerfil = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractPerfil(data);
};

export const updatePerfil = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractPerfil(data);
};

export const deletePerfil = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
