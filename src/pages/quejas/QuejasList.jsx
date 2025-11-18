import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuejas, deleteQueja } from "../../services/quejasService.js";
import { Button } from "../../components/common/Button.jsx";

const QuejasList = () => {
  const navigate = useNavigate();
  const [quejas, setQuejas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const fetchQuejas = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getQuejas();
      setQuejas(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Error cargando quejas:", err);
      setError("No se pudieron cargar las quejas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuejas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta queja?")) return;

    try {
      await deleteQueja(id);
      await fetchQuejas();
    } catch (err) {
      console.error("Error eliminando queja:", err);
      alert("No se pudo eliminar la queja");
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

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "RADICADA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "EN_REVISION":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "RESUELTA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "RECHAZADA":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const filteredQuejas = filterEstado
    ? quejas.filter((queja) => queja.estado === filterEstado)
    : quejas;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-300">
          Cargando quejas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Quejas y Reclamos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestión de quejas ciudadanas sobre comparendos
          </p>
        </div>
        <Button onClick={() => navigate("/quejas/nuevo")}>+ Nueva Queja</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filtrar por estado:
          </label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Todos</option>
            <option value="RADICADA">Radicada</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="RESUELTA">Resuelta</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Fecha Radicación
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Medio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Comparendo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Respuesta
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredQuejas.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    {filterEstado
                      ? "No hay quejas con ese estado"
                      : "No hay quejas registradas"}
                  </td>
                </tr>
              ) : (
                filteredQuejas.map((queja) => (
                  <tr
                    key={queja.id_queja}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      #{queja.id_queja}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {formatDateTime(queja.fecha_radicacion)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                        {queja.medio_radicacion || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      ID: {queja.id_comparendo || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEstadoBadgeClass(
                          queja.estado,
                        )}`}
                      >
                        {queja.estado || "RADICADA"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {queja.fecha_respuesta ? (
                        <span className="text-green-600 dark:text-green-400">
                          ✓ Respondida
                        </span>
                      ) : (
                        <span className="text-slate-400">Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/quejas/${queja.id_queja}`)}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Ver/Editar
                        </button>
                        <button
                          onClick={() => handleDelete(queja.id_queja)}
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

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {quejas.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Radicadas
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {quejas.filter((q) => q.estado === "RADICADA").length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            En Revisión
          </p>
          <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {quejas.filter((q) => q.estado === "EN_REVISION").length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Resueltas
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {quejas.filter((q) => q.estado === "RESUELTA").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuejasList;
