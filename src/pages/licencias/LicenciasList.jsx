import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getLicencias,
  deleteLicencia,
} from "../../services/licenciasService.js";
import { getUsers } from "../../services/usersService.js";
import { getCategoriasLicencia } from "../../services/categoriasLicenciaService.js";
import { getLicenciasCategoria } from "../../services/licenciaCategoriasService.js";

const LicenciasList = () => {
  const [licencias, setLicencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [relaciones, setRelaciones] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const [licResp, usersResp, catResp, relResp] = await Promise.all([
        getLicencias(),
        getUsers(),
        getCategoriasLicencia(),
        getLicenciasCategoria(),
      ]);

      setLicencias(licResp || []);
      setUsuarios(usersResp?.usuarios || usersResp || []);
      setCategorias(catResp || []);
      setRelaciones(relResp || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudieron cargar las licencias";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta licencia?")) return;

    try {
      await deleteLicencia(id);
      await fetchData();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo eliminar la licencia";
      setErrorMsg(msg);
    }
  };

  // Diccionarios para joins rápidos
  const usuariosById = usuarios.reduce((acc, u) => {
    acc[u.id_usuario] = u;
    return acc;
  }, {});

  const categoriasById = categorias.reduce((acc, c) => {
    const id = Number(c.id_categoria ?? c.id_categoria_licencia);
    if (id) acc[id] = c;
    return acc;
  }, {});

  // Decorar licencias con persona + categorías
  const decorateLicencias = licencias.map((lic) => {
    const persona = usuariosById[lic.id_persona];

    const licId = Number(lic.id_licencia ?? lic.id_licencia_conduccion);

    const relForLic = relaciones.filter((r) => {
      const rLicId = Number(r.id_licencia_conduccion ?? r.id_licencia);
      return rLicId === licId;
    });

    const categoriasList = relForLic
      .map((r) => {
        const catId = Number(r.id_categoria_licencia ?? r.id_categoria);
        return categoriasById[catId];
      })
      .filter(Boolean);

    const categoriasTexto = categoriasList.map((c) => c.codigo).join(", ");

    return {
      ...lic,
      personaNombre: persona?.username || `ID ${lic.id_persona}`,
      categoriasList,
      categoriasTexto,
    };
  });

  const filtered = decorateLicencias.filter((l) => {
    const term = search.toLowerCase();
    return (
      (l.numero_licencia || "").toLowerCase().includes(term) ||
      (l.personaNombre || "").toLowerCase().includes(term) ||
      (l.categoriasTexto || "").toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Licencias de conducción
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de licencias y sus categorías asociadas
          </p>
        </div>
        <Button as={Link} to="/licencias/nuevo" className="!no-underline">
          Nueva licencia
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
            placeholder="Buscar por número, persona o categoría..."
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
              <th className="px-4 py-2">Número</th>
              <th className="px-4 py-2">Persona</th>
              <th className="px-4 py-2">F. expedición</th>
              <th className="px-4 py-2">F. vencimiento</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Organismo expedidor</th>
              <th className="px-4 py-2">Categorías</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-sm">
                  Cargando licencias...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-sm">
                  {search
                    ? "No hay licencias que coincidan con la búsqueda."
                    : "No hay licencias registradas."}
                </td>
              </tr>
            ) : (
              paginated.map((lic) => (
                <tr
                  key={lic.id_licencia}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.id_licencia}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.numero_licencia}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.personaNombre}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.fecha_expedicion}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.fecha_vencimiento}
                  </td>

                  {/* ESTADO con badge estilo usuarios */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                        lic.estado === "ACTIVA"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/60"
                          : lic.estado === "SUSPENDIDA"
                            ? "bg-red-50 text-red-700 ring-red-100 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-800/60"
                            : "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      }`}
                    >
                      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                      {lic.estado}
                    </span>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap">
                    {lic.organismo_transito_expedidor || "—"}
                  </td>

                  {/* CATEGORÍAS como chips */}
                  <td className="px-4 py-2">
                    {lic.categoriasList && lic.categoriasList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {lic.categoriasList.map((c) => (
                          <span
                            key={c.id_categoria ?? c.id_categoria_licencia}
                            className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-inset ring-sky-100 dark:bg-sky-900/30 dark:text-sky-200 dark:ring-sky-800/60"
                          >
                            {c.codigo}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        Sin categorías
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/licencias/${lic.id_licencia}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(lic.id_licencia)}
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
            licencias
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

export default LicenciasList;
