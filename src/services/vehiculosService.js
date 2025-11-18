import apiClient from "./apiClient.js";

const base = "/vehiculos";

/**
 * Normaliza respuestas de listas
 * Soporta:
 * - [ {...} ]
 * - { vehiculos: [ ... ] }
 * - { data: [ ... ] }
 */
const extractVehiculosList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.vehiculos)) return data.vehiculos;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza respuesta de un solo vehículo
 * Soporta:
 * - { vehiculo: {...} }
 * - { data: {...} }
 * - { ...obj }
 */
const extractVehiculo = (data) => {
  if (data?.vehiculo) return data.vehiculo;
  if (data?.data) return data.data;
  return data || {};
};

export const getVehiculos = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractVehiculosList(data);
};

export const getVehiculoById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractVehiculo(data);
};

export const createVehiculo = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractVehiculo(data);
};

export const updateVehiculo = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractVehiculo(data);
};

export const deleteVehiculo = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
