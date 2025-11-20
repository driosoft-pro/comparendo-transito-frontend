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
    if (!confirm("¿Seguro que deseas eliminar esta categoría de licencia?"))
      return;

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
    const term = searchTerm.toLowerCase();
    return (
      cat.codigo.toLowerCase().includes(term) ||
      (cat.descripcion || "").toLowerCase().includes(term)
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

        <Button
          as={Link}
          to="/categorias-licencia/nuevo"
          className="!no-underline"
        >
          Nueva categoría
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
            placeholder="Buscar por código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center">
                  Cargando categorías...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              paginated.map((cat) => (
                <tr
                  key={cat.id_categoria}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-4 py-2">{cat.id_categoria}</td>
                  <td className="px-4 py-2 font-medium">{cat.codigo}</td>
                  <td className="px-4 py-2">{cat.descripcion}</td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/categorias-licencia/editar/${cat.id_categoria}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>

                      <button
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

        {/* Footer */}
        <div className="flex justify-between px-4 py-3 text-xs">
          <span>
            Mostrando {paginated.length} de {filtered.length}
          </span>

          <div className="flex gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-800"
            >
              {pageSizeOptions.map((size) => (
                <option key={size}>{size}</option>
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
