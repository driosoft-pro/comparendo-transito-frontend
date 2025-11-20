import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getSecretarias,
  deleteSecretaria,
} from "../../services/secretariasService.js";
import { getMunicipios } from "../../services/municipiosService.js";

const SecretariasList = () => {
  const [secretarias, setSecretarias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [secResp, munResp] = await Promise.all([
        getSecretarias(),
        getMunicipios(),
      ]);

      const munList = munResp?.municipios || munResp || [];
      setMunicipios(munList);

      setSecretarias(secResp || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudieron cargar las secretarías";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta secretaría?")) return;

    try {
      await deleteSecretaria(id);
      await fetchData();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo eliminar la secretaría";
      setErrorMsg(msg);
    }
  };

  const municipiosById = municipios.reduce((acc, m) => {
    acc[m.id_municipio] = m;
    return acc;
  }, {});

  const decorated = secretarias.map((s) => {
    const mun = municipiosById[s.id_municipio];
    return {
      ...s,
      nombre_municipio: mun?.nombre_municipio || `ID ${s.id_municipio}`,
    };
  });

  const filtered = decorated.filter((s) => {
    const term = search.toLowerCase();
    return (
      (s.nombre_secretaria || "").toLowerCase().includes(term) ||
      (s.nombre_municipio || "").toLowerCase().includes(term) ||
      (s.telefono || "").toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Secretarías de Tránsito
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organismos de tránsito expedidores de licencias y comparendos
          </p>
        </div>
        <Button as={Link} to="/secretarias/nuevo" className="!no-underline">
          Nueva secretaría
        </Button>
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
            placeholder="Buscar por nombre, municipio, teléfono o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm focus:border-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <span className="absolute left-3 top-2 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Municipio</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm">
                  Cargando secretarías...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm">
                  {search
                    ? "No hay secretarías que coincidan con la búsqueda."
                    : "No hay secretarías registradas."}
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr
                  key={s.id_secretaria}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.id_secretaria}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.nombre_secretaria}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.nombre_municipio}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.telefono || "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {s.email || "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/secretarias/${s.id_secretaria}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id_secretaria)}
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
            secretarías
          </span>
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
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

export default SecretariasList;
