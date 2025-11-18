import apiClient from "./apiClient.js";

const base = "/licencias";

export const getLicencias = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getLicenciaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createLicencia = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateLicencia = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteLicencia = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
