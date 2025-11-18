import apiClient from "./apiClient.js";

const base = "/quejas";

export const getQuejas = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getQuejaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createQueja = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateQueja = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteQueja = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
