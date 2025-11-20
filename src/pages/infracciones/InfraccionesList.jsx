import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getInfracciones,
  deleteInfraccion,
} from "../../services/infraccionesService.js";

// Formato dinero en pesos colombianos
const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

// Normaliza posibles respuestas del backend
const normalizeInfracciones = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.infracciones)) return data.infracciones;
  if (Array.isArray(data?.registros)) return data.registros;
  if (Array.isArray(data?.data?.infracciones)) return data.data.infracciones;
  if (Array.isArray(data?.data?.registros)) return data.data.registros;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const InfraccionesList = () => {
  const navigate = useNavigate();

  const [infracciones, setInfracciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchInfracciones = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getInfracciones();
      const list = normalizeInfracciones(data);
      setInfracciones(list);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudieron cargar las infracciones";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfracciones();
  }, []);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "¿Seguro que deseas eliminar esta infracción? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      await deleteInfraccion(id);
      await fetchInfracciones();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo eliminar la infracción";
      setErrorMsg(msg);
    }
  };

  const filtered = infracciones.filter((inf) => {
    const term = search.toLowerCase();
    return (
      (inf.codigo_infraccion || "").toLowerCase().includes(term) ||
      (inf.descripcion || "").toLowerCase().includes(term) ||
      (inf.tipo_infraccion || "").toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  const renderTipoBadge = (tipoRaw) => {
    const tipo = (tipoRaw || "").toString().toUpperCase();

    let classes =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ";
    if (tipo.includes("GRAVE")) {
      // Grave / muy grave
      classes +=
        "bg-red-50 text-red-700 ring-red-100 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-800/60";
    } else if (tipo.includes("LEVE")) {
      classes +=
        "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/60";
    } else {
      classes +=
        "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
    }

    return (
      <span className={classes}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
        {tipoRaw || "—"}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Infracciones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catálogo de infracciones de tránsito y su valor base 💸
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={fetchInfracciones} size="sm">
            Recargar
          </Button>
          <Button
            as={Link}
            to="/infracciones/nueva"
            size="sm"
            className="!no-underline"
          >
            Nueva infracción
          </Button>
        </div>
      </div>

      {/* Errores */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Buscador */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código, descripción o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-400">
            🔍
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor base</th>
              <th className="px-4 py-3">Puntos</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-sm">
                  Cargando infracciones...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-sm">
                  {search
                    ? "No hay infracciones que coincidan con la búsqueda."
                    : "No hay infracciones registradas."}
                </td>
              </tr>
            ) : (
              paginated.map((inf) => (
                <tr
                  key={inf.id_infraccion}
                  className="text-sm text-slate-700 dark:text-slate-100"
                >
                  <td className="px-4 py-2 whitespace-nowrap font-medium">
                    {inf.codigo_infraccion}
                  </td>
                  <td className="px-4 py-2">
                    <p className="line-clamp-2 text-xs sm:text-sm">
                      {inf.descripcion}
                    </p>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {renderTipoBadge(inf.tipo_infraccion)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="font-semibold">
                      {formatCOP(inf.valor_base)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {inf.puntos_descuento ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/infracciones/editar/${inf.id_infraccion}`)
                        }
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(inf.id_infraccion)}
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer paginado */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando <span className="font-semibold">{paginated.length}</span>{" "}
            de <span className="font-semibold">{filtered.length}</span>{" "}
            infracciones
          </span>
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>registros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfraccionesList;
