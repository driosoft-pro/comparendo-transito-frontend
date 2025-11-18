import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfiles, deletePerfil } from "../../services/perfilesService.js";
import { Button } from "../../components/common/Button.jsx";

const PerfilesList = () => {
  const navigate = useNavigate();
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchPerfiles = async () => {
    try {
      setLoading(true);
      setError("");
      const lista = await getPerfiles();
      setPerfiles(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error("Error cargando perfiles:", err);
      setError(
        err?.response?.data?.message || "No se pudieron cargar los perfiles",
      );
      setPerfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este perfil?")) return;

    try {
      await deletePerfil(id);
      await fetchPerfiles();
    } catch (err) {
      console.error("Error eliminando perfil:", err);
      alert(err?.response?.data?.message || "No se pudo eliminar el perfil");
    }
  };

  const displayGenero = (g) => {
    if (!g) return "Otro";
    const val = g.toString().toLowerCase();
    if (val === "masculino" || val === "m") return "Masculino";
    if (val === "femenino" || val === "f") return "Femenino";
    return "Otro";
  };

  const filteredPerfiles = perfiles.filter((perfil) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      perfil.num_doc?.toLowerCase().includes(searchLower) ||
      perfil.primer_nombre?.toLowerCase().includes(searchLower) ||
      perfil.primer_apellido?.toLowerCase().includes(searchLower) ||
      perfil.email?.toLowerCase().includes(searchLower) ||
      displayGenero(perfil.genero).toLowerCase().includes(searchLower)
    );
  });

  const paginatedPerfiles = filteredPerfiles.slice(0, pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Perfiles de ciudadanos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de perfiles y datos personales
          </p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Button onClick={() => navigate("/perfiles/nuevo")}>
            + Nuevo perfil
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
            <span></span>
          </span>
          <input
            type="text"
            placeholder="Buscar por documento, nombre, apellido, email o género..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Nombres</th>
              <th className="hidden sm:table-cell px-4 py-3">Apellidos</th>
              <th className="hidden md:table-cell px-4 py-3">Género</th>
              <th className="hidden md:table-cell px-4 py-3">Email</th>
              <th className="hidden lg:table-cell px-4 py-3">Teléfono</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Cargando perfiles...
                </td>
              </tr>
            ) : filteredPerfiles.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {searchTerm
                    ? "No se encontraron perfiles con ese criterio."
                    : "No hay perfiles registrados."}
                </td>
              </tr>
            ) : (
              paginatedPerfiles.map((perfil) => (
                <tr
                  key={perfil.id_persona}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                      {perfil.tipo_doc}
                    </div>
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {perfil.num_doc}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {perfil.primer_nombre} {perfil.segundo_nombre || ""}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 sm:hidden">
                      {perfil.primer_apellido} {perfil.segundo_apellido || ""} ·{" "}
                      {perfil.email}
                    </div>
                  </td>

                  <td className="hidden sm:table-cell px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
                    {perfil.primer_apellido} {perfil.segundo_apellido || ""}
                  </td>

                  <td className="hidden md:table-cell px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
                    {displayGenero(perfil.genero)}
                  </td>

                  <td className="hidden md:table-cell px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
                    {perfil.email}
                  </td>

                  <td className="hidden lg:table-cell px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">
                    {perfil.telefono}
                  </td>

                  <td className="px-4 py-3 align-top text-right">
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() =>
                          navigate(`/perfiles/${perfil.id_persona}`)
                        }
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(perfil.id_persona)}
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

        {/* Footer con Mostrando X de Y y selector */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando{" "}
            <span className="font-semibold">{paginatedPerfiles.length}</span> de{" "}
            <span className="font-semibold">{filteredPerfiles.length}</span>{" "}
            perfiles
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

export default PerfilesList;
