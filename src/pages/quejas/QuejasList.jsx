import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuejas, deleteQueja } from "../../services/quejasService.js";
import { getComparendos } from "../../services/comparendosService.js";
import { getUsers } from "../../services/usersService.js";
import { Button } from "../../components/common/Button.jsx";

const buildMap = (list, keyField, labelFn) => {
  const map = {};
  list.forEach((item) => {
    const key = item[keyField];
    if (key == null) return;
    map[key] = labelFn(item);
  });
  return map;
};

const QuejasList = () => {
  const navigate = useNavigate();

  const [quejas, setQuejas] = useState([]);
  const [comparendosMap, setComparendosMap] = useState({});
  const [usuariosMap, setUsuariosMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [error, setError] = useState("");

  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

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
      case "ARCHIVADA":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setLoadingRefs(true);
    setError("");

    try {
      const [queRes, compRes, usrRes] = await Promise.all([
        getQuejas(),
        getComparendos(),
        getUsers(),
      ]);

      const qList = Array.isArray(queRes) ? queRes : [];
      setQuejas(qList);

      const comps = Array.isArray(compRes)
        ? compRes
        : compRes?.comparendos || compRes?.registros || [];
      const usrs = Array.isArray(usrRes)
        ? usrRes
        : usrRes?.usuarios || usrRes?.registros || [];

      setComparendosMap(
        buildMap(comps, "id_comparendo", (c) => c.numero_comparendo),
      );
      setUsuariosMap(
        buildMap(usrs, "id_usuario", (u) => u.username || u.nombre),
      );
    } catch (err) {
      console.error("Error cargando quejas/catálogos:", err);
      setError("No se pudieron cargar las quejas");
    } finally {
      setLoading(false);
      setLoadingRefs(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (_id) => {
    if (!window.confirm("¿Está seguro de eliminar esta queja?")) return;

    try {
      await deleteQueja(_id);
      await fetchAll();
    } catch (err) {
      console.error("Error eliminando queja:", err);
      alert("No se pudo eliminar la queja");
    }
  };

  const filteredQuejas = quejas.filter((q) => {
    if (filterEstado && q.estado !== filterEstado) return false;

    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();

    const numeroComparendo =
      comparendosMap[q.id_comparendo] || String(q.id_comparendo || "");
    const nombrePersona =
      usuariosMap[q.id_persona] || String(q.id_persona || "");

    return (
      numeroComparendo.toLowerCase().includes(s) ||
      nombrePersona.toLowerCase().includes(s) ||
      (q.medio_radicacion || "").toLowerCase().includes(s) ||
      (q.texto_queja || "").toLowerCase().includes(s)
    );
  });

  const paginatedQuejas = filteredQuejas.slice(0, pageSize);

  if (loading || loadingRefs) {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Quejas y Reclamos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gestión de quejas ciudadanas sobre comparendos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchAll}>
            Recargar
          </Button>
          <Button size="sm" onClick={() => navigate("/quejas/nuevo")}>
            + Nueva Queja
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filtros + Buscador */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filtrar por estado:
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Todos</option>
              <option value="RADICADA">Radicada</option>
              <option value="EN_TRAMITE">En Revisión</option>
              <option value="RESUELTA">Resuelta</option>
              <option value="ARCHIVADA">Archivada</option>
            </select>
          </div>

          <div className="w-full md:w-72">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar por texto, persona o comparendo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  #
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
                  Persona
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
              {paginatedQuejas.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    {filterEstado || searchTerm
                      ? "No hay quejas que coincidan con el filtro"
                      : "No hay quejas registradas"}
                  </td>
                </tr>
              ) : (
                paginatedQuejas.map((q, index) => {
                  const displayNumber = index + 1;
                  const numeroComparendo =
                    comparendosMap[q.id_comparendo] ||
                    `ID: ${q.id_comparendo || "N/A"}`;
                  const nombrePersona =
                    usuariosMap[q.id_persona] || `ID: ${q.id_persona || "N/A"}`;

                  return (
                    <tr
                      key={q._id} // 👈 clave única por fila
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                        #{displayNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {formatDateTime(q.fecha_radicacion)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                          {q.medio_radicacion || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {numeroComparendo}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {nombrePersona}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEstadoBadgeClass(
                            q.estado,
                          )}`}
                        >
                          {q.estado || "RADICADA"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {q.fecha_respuesta ? (
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
                            onClick={() => navigate(`/quejas/${q._id}`)}
                            className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(q._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer paginación */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando{" "}
            <span className="font-semibold">{paginatedQuejas.length}</span> de{" "}
            <span className="font-semibold">{filteredQuejas.length}</span>{" "}
            quejas
          </span>
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
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

export default QuejasList;
