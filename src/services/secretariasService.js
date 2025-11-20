// src/services/secretariasService.js
import apiClient from "./apiClient.js";

const base = "/secretarias";

/**
 * Normaliza listas de secretarías.
 * Soporta:
 * - [ {...}, {...} ]
 * - { secretarias: [ ... ] }
 * - { registros: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { secretarias: [ ... ] } }
 * - { data: { registros: [ ... ] } }
 */
const extractSecretariasList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.secretarias)) return data.secretarias;
  if (Array.isArray(data?.registros)) return data.registros;
  if (Array.isArray(data?.data?.secretarias)) return data.data.secretarias;
  if (Array.isArray(data?.data?.registros)) return data.data.registros;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * Normaliza una sola secretaría.
 */
const extractSecretaria = (data) => {
  if (!data) return {};
  if (data.secretaria) return data.secretaria;
  if (data.registro) return data.registro;
  if (data.data?.secretaria) return data.data.secretaria;
  if (data.data?.registro) return data.data.registro;
  if (data.data) return data.data;
  return data;
};

export const getSecretarias = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractSecretariasList(data);
};

export const getSecretariaById = async (id) => {
  const { data } = await apiClient.get(`${base}/${id}`);
  return extractSecretaria(data);
};

export const createSecretaria = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractSecretaria(data);
};

export const updateSecretaria = async (id, payload) => {
  const { data } = await apiClient.put(`${base}/${id}`, payload);
  return extractSecretaria(data);
};

export const deleteSecretaria = async (id) => {
  const { data } = await apiClient.delete(`${base}/${id}`);
  return data;
};
