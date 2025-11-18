import apiClient from "./apiClient.js";

const base = "/secretarias";

export const getSecretarias = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getSecretariaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createSecretaria = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateSecretaria = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteSecretaria = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
