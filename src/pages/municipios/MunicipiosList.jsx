import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getMunicipios,
  deleteMunicipio,
} from "../../services/municipiosService.js";

const MunicipiosList = () => {
  const navigate = useNavigate();
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchMunicipios = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getMunicipios();
      setMunicipios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error getMunicipios:", err);
      const msg =
        err?.response?.data?.message || "No se pudieron cargar los municipios";
      setErrorMsg(msg);
      setMunicipios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este municipio?")) return;
    try {
      await deleteMunicipio(id);
      fetchMunicipios();
    } catch (err) {
      console.error("Error deleteMunicipio:", err);
      alert("No se pudo eliminar el municipio");
    }
  };

  const filtered = Array.isArray(municipios)
    ? municipios.filter((m) => {
        const s = searchTerm.toLowerCase();
        return (
          m.nombre_municipio?.toLowerCase().includes(s) ||
          m.departamento?.toLowerCase().includes(s) ||
          m.codigo_dane?.toLowerCase().includes(s)
        );
      })
    : [];

  const paginated = filtered.slice(0, pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Municipios 🗺️
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de municipios y secretarías de tránsito
          </p>
        </div>
        <Button onClick={() => navigate("/municipios/nuevo")}>
          + Nuevo municipio
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Buscador */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por municipio, departamento o código DANE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Municipio</th>
              <th className="px-4 py-3">Departamento</th>
              <th className="hidden sm:table-cell px-4 py-3">Código DANE</th>
              <th className="hidden md:table-cell px-4 py-3">
                Dirección oficina
              </th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm">
                  Cargando municipios...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-sm">
                  {searchTerm
                    ? "No se encontraron municipios con ese criterio."
                    : "No hay municipios registrados."}
                </td>
              </tr>
            ) : (
              paginated.map((m) => (
                <tr
                  key={m.id_municipio}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">{m.nombre_municipio}</td>
                  <td className="px-4 py-3">{m.departamento}</td>
                  <td className="hidden sm:table-cell px-4 py-3">
                    {m.codigo_dane}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3">
                    {m.direccion_oficina_principal}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 text-xs">
                      <Link
                        to={`/municipios/${m.id_municipio}`}
                        className="text-sky-600 hover:underline dark:text-sky-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id_municipio)}
                        className="text-red-600 hover:underline dark:text-red-400"
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

        {/* Footer paginación */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando <span className="font-semibold">{paginated.length}</span>{" "}
            de <span className="font-semibold">{filtered.length}</span>{" "}
            municipios
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

export default MunicipiosList;
