import apiClient from "./apiClient.js";

const base = "/comparendo-infracciones";

/**
 * Normaliza la respuesta del backend para listas de comparendo_infraccion.
 * Soporta:
 * - [ {...}, {...} ]
 * - { comparendo_infracciones: [ ... ] }
 * - { registros: [ ... ] }
 * - { data: [ ... ] }
 * - { data: { comparendo_infracciones: [ ... ] } }
 * - { data: { registros: [ ... ] } }
 * - { id_comparendo, id_infraccion, ... } (un solo objeto)
 */
const extractComparendoInfraccionesList = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.comparendo_infracciones)) {
    return data.comparendo_infracciones;
  }

  if (Array.isArray(data?.registros)) return data.registros;

  if (Array.isArray(data?.data?.comparendo_infracciones)) {
    return data.data.comparendo_infracciones;
  }

  if (Array.isArray(data?.data?.registros)) {
    return data.data.registros;
  }

  if (Array.isArray(data?.data)) return data.data;

  // Si viene un solo objeto plano { id_comparendo, id_infraccion, ... }
  if (
    data &&
    typeof data === "object" &&
    "id_comparendo" in data &&
    "id_infraccion" in data
  ) {
    return [data];
  }

  return [];
};

/**
 * Normaliza la respuesta del backend para un solo registro
 * de la tabla comparendo_infraccion.
 */
const extractComparendoInfraccionItem = (data) => {
  if (!data) return null;
  if (data.comparendo_infraccion) return data.comparendo_infraccion;
  if (data.registro) return data.registro;
  if (data.data?.comparendo_infraccion) return data.data.comparendo_infraccion;
  if (data.data?.registro) return data.data.registro;
  if (data.data) return data.data;
  return data;
};

/**
 * Obtener lista general de comparendo_infracciones.
 * Puedes filtrar con params (ej: { id_comparendo: 1 }).
 */
export const getComparendoInfracciones = async (params = {}) => {
  const { data } = await apiClient.get(base, { params });
  return extractComparendoInfraccionesList(data);
};

/**
 * Helper específico:
 * Obtener TODAS las infracciones asociadas a un comparendo.
 * GET /comparendo-infracciones?id_comparendo=ID
 */
export const getInfraccionesByComparendo = async (
  idComparendo,
  extraParams = {},
) => {
  const params = { ...extraParams, id_comparendo: idComparendo };
  const { data } = await apiClient.get(base, { params });
  return extractComparendoInfraccionesList(data);
};

/**
 * Crear relación comparendo_infraccion.
 * payload:
 * {
 *   id_comparendo,
 *   id_infraccion,
 *   valor_calculado,
 *   observaciones?
 * }
 */
export const createComparendoInfraccion = async (payload) => {
  const { data } = await apiClient.post(base, payload);
  return extractComparendoInfraccionItem(data);
};

/**
 * Eliminar relación comparendo_infraccion usando la PK compuesta.
 * Aquí supongo que tu backend acepta DELETE con body JSON:
 * { id_comparendo, id_infraccion }
 * Si lo haces por query, cambia a: apiClient.delete(base, { params: {...} })
 */
export const deleteComparendoInfraccion = async (
  id_comparendo,
  id_infraccion,
) => {
  const { data } = await apiClient.delete(base, {
    data: { id_comparendo, id_infraccion },
  });
  return data;
};
