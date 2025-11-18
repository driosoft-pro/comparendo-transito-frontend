import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getVehiculos,
  deleteVehiculo,
} from "../../services/vehiculosService.js";

const VehiculosList = () => {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación 5 / 10 / 15 / 20
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchVehiculos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getVehiculos();
      setVehiculos(data.vehiculos || data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudieron cargar los vehículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este vehículo?")) return;

    try {
      await deleteVehiculo(id);
      fetchVehiculos();
    } catch (err) {
      alert("No se pudo eliminar el vehículo");
    }
  };

  const filtered = vehiculos.filter((v) => {
    const s = searchTerm.toLowerCase();
    return (
      v.placa?.toLowerCase().includes(s) ||
      v.marca?.toLowerCase().includes(s) ||
      v.linea_modelo?.toLowerCase().includes(s) ||
      v.color?.toLowerCase().includes(s)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Vehículos registrados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de vehículos del sistema
          </p>
        </div>

        <Button onClick={() => navigate("/vehiculos/nuevo")}>
          + Nuevo vehículo
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
            <span></span>
          </span>
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Placa</th>
              <th className="px-4 py-3">Marca</th>
              <th className="hidden sm:table-cell px-4 py-3">Modelo</th>
              <th className="hidden md:table-cell px-4 py-3">Año</th>
              <th className="hidden md:table-cell px-4 py-3">Color</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center">
                  Cargando vehículos...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center">
                  {searchTerm
                    ? "No se encontraron coincidencias."
                    : "No hay vehículos registrados."}
                </td>
              </tr>
            ) : (
              paginated.map((v) => (
                <tr
                  key={v.id_automotor}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">{v.placa}</td>
                  <td className="px-4 py-3">{v.marca}</td>
                  <td className="hidden sm:table-cell px-4 py-3">
                    {v.linea_modelo}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3">
                    {v.modelo_ano}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3">{v.color}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 text-xs">
                      <Link
                        to={`/vehiculos/${v.id_automotor}`}
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id_automotor)}
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

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs sm:flex-row dark:text-slate-400">
          <span>
            Mostrando <b>{paginated.length}</b> de <b>{filtered.length}</b>{" "}
            vehículos
          </span>
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800"
            >
              {pageSizeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
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

export default VehiculosList;
