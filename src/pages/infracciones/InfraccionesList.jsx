import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getInfracciones,
  deleteInfraccion,
} from "../../services/infraccionesService.js";

// Format dinero en pesos
const formatCOP = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

// Badge de colores según tipo
const TipoBadge = ({ tipo }) => {
  const t = tipo?.toLowerCase();

  let color = "bg-slate-200 text-slate-700";
  if (t.includes("grave")) color = "bg-red-200 text-red-800";
  else if (t.includes("moderada")) color = "bg-orange-200 text-orange-800";
  else if (t.includes("leve")) color = "bg-green-200 text-green-800";
  else color = "bg-blue-200 text-blue-800";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {tipo}
    </span>
  );
};

const InfraccionesList = () => {
  const navigate = useNavigate();
  const [infracciones, setInfracciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getInfracciones();
      setInfracciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudieron cargar las infracciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = infracciones.filter((inf) => {
    const s = searchTerm.toLowerCase();
    return (
      inf.codigo_infraccion?.toLowerCase().includes(s) ||
      inf.descripcion?.toLowerCase().includes(s) ||
      inf.tipo_infraccion?.toLowerCase().includes(s)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar infracción?")) return;
    await deleteInfraccion(id);
    fetchData();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold dark:text-white">
            Infracciones ⚠️
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catálogo oficial de infracciones
          </p>
        </div>
        <Button onClick={() => navigate("/infracciones/nueva")}>+ Nueva</Button>
      </div>

      {/* Search */}
      <div className="rounded-lg border p-4 dark:border-slate-700 dark:bg-slate-900">
        <input
          type="text"
          placeholder="Buscar por código, tipo o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 dark:bg-slate-800 dark:border-slate-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor base</th>
              <th className="px-4 py-3">Puntos</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  Cargando infracciones...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center">
                  No hay resultados
                </td>
              </tr>
            ) : (
              paginated.map((inf) => (
                <tr key={inf.id_infraccion}>
                  <td className="px-4 py-3">{inf.codigo_infraccion}</td>
                  <td className="px-4 py-3">{inf.descripcion}</td>

                  {/* BADGE por tipo */}
                  <td className="px-4 py-3">
                    <TipoBadge tipo={inf.tipo_infraccion} />
                  </td>

                  {/* Formateo COP */}
                  <td className="px-4 py-3 font-medium">
                    {formatCOP(inf.valor_base)}
                  </td>

                  <td className="px-4 py-3">{inf.puntos_descuento || "-"}</td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 text-xs">
                      <Link
                        to={`/infracciones/${inf.id_infraccion}`}
                        className="text-sky-600 dark:text-sky-400"
                      >
                        Editar
                      </Link>
                      <button
                        className="text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(inf.id_infraccion)}
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

        {/* Footer paginación */}
        <div className="flex justify-between p-3 text-xs dark:text-slate-400">
          <span>
            Mostrando {paginated.length} de {filtered.length}
          </span>

          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border rounded px-2 py-1 dark:bg-slate-800"
            >
              {pageSizeOptions.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <span>registros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfraccionesList;
