import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button.jsx';
import {
  getInfracciones,
  deleteInfraccion,
} from '../../services/infraccionesService.js';

const InfraccionesList = () => {
  const [infracciones, setInfracciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInfracciones = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await getInfracciones();
      setInfracciones(data.infracciones || data.rows || data || []);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        'No se pudieron cargar las infracciones';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfracciones();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta infracción?')) return;
    try {
      await deleteInfraccion(id);
      await fetchInfracciones();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        'No se pudo eliminar la infracción';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Infracciones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catálogo de infracciones configuradas en el sistema.
          </p>
        </div>
        <Button as={Link} to="/infracciones/nuevo" className="!no-underline">
          Nueva infracción
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
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm">
                  Cargando infracciones...
                </td>
              </tr>
            ) : infracciones.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-sm">
                  No hay infracciones registradas.
                </td>
              </tr>
            ) : (
              infracciones.map((i) => (
                <tr
                  key={i.id_infraccion || i.id}
                  className="border-t border-slate-100 text-sm dark:border-slate-800"
                >
                  <td className="px-4 py-2">
                    {i.id_infraccion || i.id}
                  </td>
                  <td className="px-4 py-2">{i.codigo}</td>
                  <td className="px-4 py-2">{i.descripcion}</td>
                  <td className="px-4 py-2">
                    {i.valor != null ? `$${i.valor}` : '-'}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/infracciones/${i.id_infraccion || i.id}`}
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(i.id_infraccion || i.id)
                        }
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

export default InfraccionesList;
