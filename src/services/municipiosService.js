import apiClient from "./apiClient.js";

const base = "/municipios";

// Normaliza lista de municipios
const extractMunicipiosList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.municipios)) return data.municipios;
  if (Array.isArray(data?.data?.municipios)) return data.data.municipios;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Normaliza un municipio
const extractMunicipio = (data) => {
  if (!data) return {};
  if (data.municipio) return data.municipio;
  if (data.data?.municipio) return data.data.municipio;
  if (data.data) return data.data;
  return data || {};
};

export const getMunicipios = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractMunicipiosList(data);
};

export const getMunicipioById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractMunicipio(data);
};

export const createMunicipio = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractMunicipio(data);
};

export const updateMunicipio = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractMunicipio(data);
};

export const deleteMunicipio = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
