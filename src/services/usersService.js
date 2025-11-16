
import apiClient from './apiClient.js';

export const getUsers = async (params = {}) => {
  const { data } = await apiClient.get('/usuarios', { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/usuarios/${id}`);
  return data;
};

export const createUser = async (payload) => {
  const { data } = await apiClient.post('/usuarios', payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await apiClient.put(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/usuarios/${id}`);
  return data;
};
