
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';
import {
  deleteUser,
  getUsers,
} from '../../services/usersService.js';

const UsersList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getUsers();
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || 'No se pudieron cargar los usuarios';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || 'No se pudo eliminar el usuario';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Usuarios
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            CRUD básico de usuarios consumiendo la API.
          </p>
        </div>
        <Button as={Link} to="/usuarios/nuevo" className="!no-underline">
          Nuevo usuario
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
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
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr
                  key={u.id_usuario}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2">{u.id_usuario}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.rol}</td>
                  <td className="px-4 py-2">
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
      </div>
    </div>
  );
};

export default UsersList;
