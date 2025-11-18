import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import { deleteUser, getUsers } from "../../services/usersService.js";

const UsersList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getUsers();
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudieron cargar los usuarios";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo eliminar el usuario";
      setErrorMsg(msg);
    }
  };

  const filteredUsers = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.username.toLowerCase().includes(searchLower) ||
      usuario.rol.toLowerCase().includes(searchLower)
    );
  });

  const paginatedUsers = filteredUsers.slice(0, pageSize);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Usuarios
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de usuarios
          </p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Button as={Link} to="/usuarios/nuevo" className="!no-underline">
            Nuevo usuario
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
            <span></span>
          </span>
          <input
            type="text"
            placeholder="Buscar por usuario o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="hidden sm:table-cell px-4 py-2">Rol</th>
              <th className="hidden sm:table-cell px-4 py-2">Estado</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm">
                  Cargando usuarios...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm">
                  {searchTerm
                    ? "No hay usuarios que coincidan con la búsqueda."
                    : "No hay usuarios registrados."}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr
                  key={u.id_usuario}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {u.id_usuario}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span>{u.username}</span>
                      <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 sm:hidden">
                        {u.rol} · {u.estado === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-2">{u.rol}</td>
                  <td className="hidden sm:table-cell px-4 py-2">
                    {u.estado === 1 ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                        Activo
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-200">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/usuarios/${u.id_usuario}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id_usuario)}
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

        {/* Footer: Mostrando X de Y y selector 5 / 10 / 15 / 20 */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando{" "}
            <span className="font-semibold">{paginatedUsers.length}</span> de{" "}
            <span className="font-semibold">{filteredUsers.length}</span>{" "}
            usuarios
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

export default UsersList;
