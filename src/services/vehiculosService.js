import apiClient from "./apiClient.js";

const base = "/vehiculos";

const extractVehiculosList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.vehiculos)) return data.vehiculos;
  if (Array.isArray(data?.data?.vehiculos)) return data.data.vehiculos;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const extractVehiculo = (data) => {
  if (!data) return {};

  // cualquiera de estas estructuras sirve:
  if (data.vehiculo) return data.vehiculo;
  if (data.automotor) return data.automotor;
  if (data.data?.vehiculo) return data.data.vehiculo;
  if (data.data?.automotor) return data.data.automotor;
  if (data.data) return data.data;

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
