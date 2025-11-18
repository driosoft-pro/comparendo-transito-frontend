import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getComparendos,
  deleteComparendo,
} from "../../services/comparendosService.js";
import { Button } from "../../components/common/Button.jsx";

const ComparendosList = () => {
  const navigate = useNavigate();
  const [comparendos, setComparendos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComparendos = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getComparendos();
      setComparendos(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error cargando comparendos:", err);
      setError("No se pudieron cargar los comparendos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparendos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este comparendo?")) return;

    try {
      await deleteComparendo(id);
      await fetchComparendos();
    } catch (err) {
      console.error("Error eliminando comparendo:", err);
      alert("No se pudo eliminar el comparendo");
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    return date.toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-300">
          Cargando comparendos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Comparendos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestión de comparendos de tránsito
          </p>
        </div>
        <Button onClick={() => navigate("/comparendos/nuevo")}>
          + Nuevo Comparendo
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Número
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Fecha/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Dirección
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Placa
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {comparendos.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No hay comparendos registrados
                  </td>
                </tr>
              ) : (
                comparendos.map((comp) => (
                  <tr
                    key={comp.id_comparendo}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {comp.numero_comparendo || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatDateTime(comp.fecha_hora_registro)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {comp.direccion_infraccion || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          comp.estado === "PAGADO"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : comp.estado === "ANULADO"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {comp.estado || "PENDIENTE"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-300">
                      {comp.placa_automotor || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/comparendos/${comp.id_comparendo}`)
                          }
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Ver/Editar
                        </button>
                        <button
                          onClick={() => handleDelete(comp.id_comparendo)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
    </div>
  );
};

export default ComparendosList;
