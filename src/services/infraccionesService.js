import apiClient from "./apiClient.js";

const base = "/infracciones";

// Normaliza lista
const normalizeInfraccionesList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.infracciones)) return data.infracciones;
  if (Array.isArray(data?.registros)) return data.registros;
  if (Array.isArray(data?.data?.infracciones)) return data.data.infracciones;
  if (Array.isArray(data?.data?.registros)) return data.data.registros;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Normaliza una infracción
const normalizeInfraccionItem = (data) => {
  if (!data) return null;
  if (data.infraccion) return data.infraccion;
  if (data.registro) return data.registro;
  if (data.data?.infraccion) return data.data.infraccion;
  if (data.data?.registro) return data.data.registro;
  if (data.data) return data.data;
  return data;
};

export const getInfracciones = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return normalizeInfraccionesList(data);
};

export const getInfraccionById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return normalizeInfraccionItem(data);
};

export const createInfraccion = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return normalizeInfraccionItem(data);
};

export const updateInfraccion = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return normalizeInfraccionItem(data);
};

export const deleteInfraccion = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
