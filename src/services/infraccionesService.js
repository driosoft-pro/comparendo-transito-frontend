import apiClient from "./apiClient.js";

const base = "/infracciones";

export const getInfracciones = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getInfraccionById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createInfraccion = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateInfraccion = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteInfraccion = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
