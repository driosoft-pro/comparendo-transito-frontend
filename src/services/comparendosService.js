import apiClient from "./apiClient.js";

const base = "/comparendos";

export const getComparendos = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getComparendoById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createComparendo = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateComparendo = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteComparendo = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
