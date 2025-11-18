import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  deleteCategoriaLicencia,
  getCategoriasLicencia,
} from "../../services/categoriasLicenciaService.js";

const CategoriasLicenciaList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchCategorias = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getCategoriasLicencia();
      // backend: [{ id_categoria, codigo, descripcion, deleted_at }]
      setCategorias(data || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudieron cargar las categorías de licencia";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría de licencia?")) {
      return;
    }
    try {
      await deleteCategoriaLicencia(id);
      await fetchCategorias();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudo eliminar la categoría de licencia";
      setErrorMsg(msg);
    }
  };

  const filtered = categorias.filter((cat) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (cat.codigo || "").toLowerCase().includes(searchLower) ||
      (cat.descripcion || "").toLowerCase().includes(searchLower)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Categorías de licencia
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de categorías para licencias de conducción
          </p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Button
            as={Link}
            to="/categorias-licencia/nuevo"
            className="!no-underline"
          >
            Nueva categoría
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
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
            <span></span>
          </span>
          <input
            type="text"
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-sm">
                  Cargando categorías...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-sm">
                  {searchTerm
                    ? "No hay categorías que coincidan con la búsqueda."
                    : "No hay categorías registradas."}
                </td>
              </tr>
            ) : (
              paginated.map((cat) => (
                <tr
                  key={cat.id_categoria}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {cat.id_categoria}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-medium">
                    {cat.codigo}
                  </td>
                  <td className="px-4 py-2">
                    {cat.descripcion || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/categorias-licencia/${cat.id_categoria}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id_categoria)}
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
            categorías
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

export default CategoriasLicenciaList;
