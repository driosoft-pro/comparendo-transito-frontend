import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button.jsx";
import {
  getComparendos,
  deleteComparendo,
} from "../../services/comparendosService.js";
import { getMunicipios } from "../../services/municipiosService.js";
import { getLicencias } from "../../services/licenciasService.js";
import { getUsers } from "../../services/usersService.js";
import { getVehiculos } from "../../services/vehiculosService.js";
import { getInfracciones } from "../../services/infraccionesService.js";
import { getInfraccionesByComparendo } from "../../services/comparendoInfraccionesService.js";

const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return String(value).replace("T", " ");
  }
  return d.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatEstadoBadge = (estadoRaw) => {
  const estado = (estadoRaw || "").toUpperCase();
  let classes =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ";

  if (estado === "PENDIENTE") {
    classes +=
      "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/60";
  } else if (estado === "PAGADO" || estado === "CERRADO") {
    classes +=
      "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/60";
  } else if (estado === "ANULADO" || estado === "CANCELADO") {
    classes +=
      "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  } else if (estado === "IMPUGNADO") {
    classes +=
      "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800/60";
  } else {
    classes +=
      "bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700";
  }

  return (
    <span className={classes}>
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {estadoRaw || "—"}
    </span>
  );
};

const buildMap = (list, keyField, labelFn) => {
  const map = {};
  list.forEach((item) => {
    const key = item[keyField];
    if (key == null) return;
    map[key] = labelFn(item);
  });
  return map;
};

const formatCurrencyCOP = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "";
  return Number(value).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
};

const ComparendosList = () => {
  const navigate = useNavigate();

  const [comparendos, setComparendos] = useState([]);
  const [municipiosMap, setMunicipiosMap] = useState({});
  const [licenciasMap, setLicenciasMap] = useState({});
  const [usuariosMap, setUsuariosMap] = useState({});
  const [vehiculosMap, setVehiculosMap] = useState({});
  const [infraccionesMap, setInfraccionesMap] = useState({});
  const [comparendoInfraccionesMap, setComparendoInfraccionesMap] = useState(
    {},
  ); // id_comparendo -> [ { id_comparendo, id_infraccion, valor_calculado, ... } ]

  const [loading, setLoading] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [loadingRelaciones, setLoadingRelaciones] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 15, 20];

  // Catálogos básicos (municipios, licencias, usuarios, vehículos, infracciones)
  const fetchRefs = async () => {
    setLoadingRefs(true);
    try {
      const [munRes, licRes, usrRes, vehRes, infrRes] = await Promise.all([
        getMunicipios(),
        getLicencias(),
        getUsers(),
        getVehiculos(),
        getInfracciones(),
      ]);

      const municipios = Array.isArray(munRes)
        ? munRes
        : munRes?.municipios || munRes?.registros || [];

      const licencias = Array.isArray(licRes)
        ? licRes
        : licRes?.licencias || licRes?.registros || [];

      const usuarios = Array.isArray(usrRes)
        ? usrRes
        : usrRes?.usuarios || usrRes?.registros || [];

      const vehiculos = Array.isArray(vehRes)
        ? vehRes
        : vehRes?.vehiculos || vehRes?.registros || [];

      const infracciones = Array.isArray(infrRes)
        ? infrRes
        : infrRes?.infracciones || infrRes?.registros || [];

      setMunicipiosMap(
        buildMap(municipios, "id_municipio", (m) => m.nombre_municipio),
      );
      setLicenciasMap(
        buildMap(licencias, "id_licencia", (l) => l.numero_licencia),
      );
      setUsuariosMap(
        buildMap(usuarios, "id_usuario", (u) => u.username || u.nombre),
      );
      setVehiculosMap(
        buildMap(vehiculos, "id_automotor", (v) => v.placa || v.placa_vehiculo),
      );

      // id_infraccion -> "C01 - descripción"
      setInfraccionesMap(
        buildMap(
          infracciones,
          "id_infraccion",
          (inf) =>
            `${inf.codigo_infraccion} - ${
              inf.descripcion || inf.descripcion_infraccion || ""
            }`,
        ),
      );
    } catch (error) {
      console.error("Error cargando catálogos para comparendos:", error);
    } finally {
      setLoadingRefs(false);
    }
  };

  // Comparendos
  const fetchComparendos = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await getComparendos();
      const list = Array.isArray(data)
        ? data
        : data?.comparendos || data?.registros || [];
      setComparendos(list);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudieron cargar los comparendos";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefs();
    fetchComparendos();
  }, []);

  // 🔥 NUEVO: cargar infracciones por cada comparendo usando el helper que ya funciona
  useEffect(() => {
    const loadRelaciones = async () => {
      if (!comparendos.length) {
        setComparendoInfraccionesMap({});
        return;
      }

      setLoadingRelaciones(true);
      try {
        const grouped = {};

        await Promise.all(
          comparendos.map(async (c) => {
            try {
              const rels = await getInfraccionesByComparendo(c.id_comparendo);
              if (rels && rels.length) {
                grouped[c.id_comparendo] = rels;
              }
            } catch (err) {
              console.error(
                `Error cargando infracciones del comparendo ${c.id_comparendo}:`,
                err,
              );
            }
          }),
        );

        setComparendoInfraccionesMap(grouped);
      } catch (err) {
        console.error("Error cargando relaciones comparendo-infracción:", err);
      } finally {
        setLoadingRelaciones(false);
      }
    };

    loadRelaciones();
  }, [comparendos]);

  const handleDelete = async (id) => {
    if (
      !confirm(
        "¿Seguro que deseas eliminar este comparendo? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      await deleteComparendo(id);
      await fetchComparendos();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo eliminar el comparendo";
      setErrorMsg(msg);
    }
  };

  const filtered = comparendos.filter((c) => {
    const term = search.toLowerCase();

    const persona = usuariosMap[c.id_persona] || "";
    const policia = usuariosMap[c.id_policia_transito] || "";
    const placa = vehiculosMap[c.id_automotor] || "";
    const municipio = municipiosMap[c.id_municipio] || "";
    const infraccionesTexto = (comparendoInfraccionesMap[c.id_comparendo] || [])
      .map((ci) => infraccionesMap[ci.id_infraccion] || "")
      .join(" ");

    return (
      (c.numero_comparendo || "").toLowerCase().includes(term) ||
      persona.toLowerCase().includes(term) ||
      policia.toLowerCase().includes(term) ||
      placa.toLowerCase().includes(term) ||
      municipio.toLowerCase().includes(term) ||
      infraccionesTexto.toLowerCase().includes(term) ||
      (c.estado || "").toLowerCase().includes(term)
    );
  });

  const paginated = filtered.slice(0, pageSize);

  const isLoadingAny = loading || loadingRefs || loadingRelaciones;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Comparendos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gestión de comparendos de tránsito emitidos 🚧
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              fetchRefs();
              fetchComparendos();
            }}
          >
            Recargar
          </Button>
          <Button
            as={Link}
            to="/comparendos/nuevo"
            size="sm"
            className="!no-underline"
          >
            Nuevo comparendo
          </Button>
        </div>
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
            placeholder="Buscar por número, persona, placa, municipio, infracción o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-8 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-400">
            🔍
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Fecha / hora</th>
              <th className="px-4 py-3">Municipio</th>
              <th className="px-4 py-3">Persona</th>
              <th className="px-4 py-3">Licencia</th>
              <th className="px-4 py-3">Vehículo</th>
              <th className="px-4 py-3">Policía tránsito</th>
              <th className="px-4 py-3">Infracciones</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-slate-700">
            {isLoadingAny ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-sm">
                  Cargando comparendos...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-sm">
                  {search
                    ? "No hay comparendos que coincidan con la búsqueda."
                    : "No hay comparendos registrados."}
                </td>
              </tr>
            ) : (
              paginated.map((c) => (
                <tr
                  key={c.id_comparendo}
                  className="text-sm text-slate-700 dark:text-slate-100"
                >
                  <td className="px-4 py-2 whitespace-nowrap font-medium">
                    {c.numero_comparendo}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatDateTime(c.fecha_hora_registro)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {municipiosMap[c.id_municipio] || "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {usuariosMap[c.id_persona] || "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {licenciasMap[c.id_licencia_conduccion] || "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {vehiculosMap[c.id_automotor] || "—"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {usuariosMap[c.id_policia_transito] || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {(comparendoInfraccionesMap[c.id_comparendo] || [])
                      .length === 0 ? (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        — Sin infracciones asociadas —
                      </span>
                    ) : (
                      <div className="space-y-0.5 max-w-xs">
                        {comparendoInfraccionesMap[c.id_comparendo].map(
                          (ci) => {
                            const label =
                              infraccionesMap[ci.id_infraccion] ||
                              `Infracción #${ci.id_infraccion}`;
                            return (
                              <div
                                key={`${ci.id_comparendo}-${ci.id_infraccion}`}
                                className="leading-tight"
                              >
                                <span
                                  className="block truncate text-xs"
                                  title={label}
                                >
                                  {label}
                                </span>
                                {ci.valor_calculado != null && (
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {formatCurrencyCOP(ci.valor_calculado)}
                                  </span>
                                )}
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatEstadoBadge(c.estado)}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/comparendos/editar/${c.id_comparendo}`)
                        }
                        className="text-xs text-primary-600 hover:underline dark:text-primary-400"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id_comparendo)}
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

        {/* Footer paginado */}
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
          <span>
            Mostrando <span className="font-semibold">{paginated.length}</span>{" "}
            de <span className="font-semibold">{filtered.length}</span>{" "}
            comparendos
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

export default ComparendosList;
