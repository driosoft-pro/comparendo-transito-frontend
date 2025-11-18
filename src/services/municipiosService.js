import apiClient from "./apiClient.js";

const base = "/municipios";

export const getMunicipios = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return data;
};

export const getMunicipioById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return data;
};

export const createMunicipio = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return data;
};

export const updateMunicipio = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return data;
};

export const deleteMunicipio = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
