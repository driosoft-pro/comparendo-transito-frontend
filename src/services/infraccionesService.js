import apiClient from "./apiClient.js";

const base = "/infracciones";

// Normaliza lista
const extractInfraccionesList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.infracciones)) return data.infracciones;
  if (Array.isArray(data?.data?.infracciones)) return data.data.infracciones;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Normaliza una infracción
const extractInfraccion = (data) => {
  if (!data) return {};

  if (data.infraccion) return data.infraccion;
  if (data.data?.infraccion) return data.data.infraccion;
  if (data.data) return data.data;

  return data || {};
};

export const getInfracciones = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractInfraccionesList(data);
};

export const getInfraccionById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractInfraccion(data);
};

export const createInfraccion = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractInfraccion(data);
};

export const updateInfraccion = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractInfraccion(data);
};

export const deleteInfraccion = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
