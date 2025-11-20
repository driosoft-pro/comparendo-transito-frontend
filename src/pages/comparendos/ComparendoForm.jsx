import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createComparendo,
  getComparendoById,
  updateComparendo,
} from "../../services/comparendosService.js";
import { getMunicipios } from "../../services/municipiosService.js";
import { getLicencias } from "../../services/licenciasService.js";
import { getUsers } from "../../services/usersService.js";
import { getVehiculos } from "../../services/vehiculosService.js";

const toDateTimeLocal = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 16);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
};

const ComparendoForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    numero_comparendo: "",
    fecha_hora_registro: "",
    direccion_infraccion: "",
    coordenadas_gps: "",
    observaciones: "",
    estado: "PENDIENTE",
    id_municipio: "",
    id_persona: "",
    id_licencia_conduccion: "",
    id_policia_transito: "",
    id_automotor: "",
  });

  const [municipios, setMunicipios] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Catálogos
  useEffect(() => {
    const fetchRefs = async () => {
      setLoadingRefs(true);
      try {
        const [munRes, licRes, usrRes, vehRes] = await Promise.all([
          getMunicipios(),
          getLicencias(),
          getUsers(),
          getVehiculos(),
        ]);

        const munList = Array.isArray(munRes)
          ? munRes
          : munRes?.municipios || munRes?.registros || [];
        const licList = Array.isArray(licRes)
          ? licRes
          : licRes?.licencias || licRes?.registros || [];
        const usrList = Array.isArray(usrRes)
          ? usrRes
          : usrRes?.usuarios || usrRes?.registros || [];
        const vehList = Array.isArray(vehRes)
          ? vehRes
          : vehRes?.vehiculos || vehRes?.registros || [];

        setMunicipios(munList);
        setLicencias(licList);
        setUsuarios(usrList);
        setVehiculos(vehList);
      } catch (error) {
        console.error("Error cargando catálogos de comparendos:", error);
      } finally {
        setLoadingRefs(false);
      }
    };

    fetchRefs();
  }, []);

  // Comparendo (edición)
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchComparendo = async () => {
      setErrorMsg("");
      try {
        const data = await getComparendoById(id);
        const c = data?.comparendo || data;

        setForm({
          numero_comparendo: c.numero_comparendo || "",
          fecha_hora_registro: toDateTimeLocal(c.fecha_hora_registro),
          direccion_infraccion: c.direccion_infraccion || "",
          coordenadas_gps: c.coordenadas_gps || "",
          observaciones: c.observaciones || "",
          estado: c.estado || "PENDIENTE",
          id_municipio: c.id_municipio ?? "",
          id_persona: c.id_persona ?? "",
          id_licencia_conduccion: c.id_licencia_conduccion ?? "",
          id_policia_transito: c.id_policia_transito ?? "",
          id_automotor: c.id_automotor ?? "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message || "No se pudo cargar el comparendo";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchComparendo();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const isIdField = [
      "id_municipio",
      "id_persona",
      "id_licencia_conduccion",
      "id_policia_transito",
      "id_automotor",
    ].includes(name);

    setForm((prev) => ({
      ...prev,
      [name]: isIdField ? (value ? Number(value) : "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        numero_comparendo: form.numero_comparendo,
        fecha_hora_registro: form.fecha_hora_registro || null,
        direccion_infraccion: form.direccion_infraccion,
        coordenadas_gps: form.coordenadas_gps || null,
        observaciones: form.observaciones || null,
        estado: form.estado,
        id_municipio: form.id_municipio || null,
        id_persona: form.id_persona || null,
        id_licencia_conduccion: form.id_licencia_conduccion || null,
        id_policia_transito: form.id_policia_transito || null,
        id_automotor: form.id_automotor || null,
      };

      if (isEdit) {
        await updateComparendo(id, payload);
      } else {
        await createComparendo(payload);
      }

      navigate("/comparendos");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar el comparendo";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando comparendo...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar comparendo" : "Nuevo comparendo"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro detallado del comparendo de tránsito.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/comparendos")}>
          Volver
        </Button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Número + fecha/hora */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Número de comparendo"
            name="numero_comparendo"
            value={form.numero_comparendo}
            onChange={handleChange}
            placeholder="Ej: COMP-2025-001"
            required
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha y hora de registro
            </label>
            <input
              type="datetime-local"
              name="fecha_hora_registro"
              value={form.fecha_hora_registro}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>
        </div>

        {/* Dirección + coordenadas */}
        <Input
          label="Dirección de la infracción"
          name="direccion_infraccion"
          value={form.direccion_infraccion}
          onChange={handleChange}
          placeholder="Calle 5 con Carrera 50, Cali"
          required
        />

        <Input
          label="Coordenadas GPS (opcional)"
          name="coordenadas_gps"
          value={form.coordenadas_gps}
          onChange={handleChange}
          placeholder="3.4372,-76.5225"
        />

        {/* Observaciones */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Detalle adicional del operativo, estado del conductor, etc."
          />
        </div>

        {/* Estado + municipio */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_PROCESO">EN PROCESO</option>
              <option value="PAGADO">PAGADO</option>
              <option value="IMPUGNADO">IMPUGNADO</option>
              <option value="ANULADO">ANULADO</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Municipio
            </label>
            <select
              name="id_municipio"
              value={form.id_municipio}
              onChange={handleChange}
              disabled={loadingRefs && !municipios.length}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map((m) => (
                <option key={m.id_municipio} value={m.id_municipio}>
                  {m.nombre_municipio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Persona + licencia */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Persona (conductor)
            </label>
            <select
              name="id_persona"
              value={form.id_persona}
              onChange={handleChange}
              disabled={loadingRefs && !usuarios.length}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Seleccione una persona</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Licencia de conducción
            </label>
            <select
              name="id_licencia_conduccion"
              value={form.id_licencia_conduccion}
              onChange={handleChange}
              disabled={loadingRefs && !licencias.length}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Seleccione una licencia</option>
              {licencias.map((l) => (
                <option key={l.id_licencia} value={l.id_licencia}>
                  {l.numero_licencia}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehículo + policía tránsito */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Vehículo (placa)
            </label>
            <select
              name="id_automotor"
              value={form.id_automotor}
              onChange={handleChange}
              disabled={loadingRefs && !vehiculos.length}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Seleccione un vehículo</option>
              {vehiculos.map((v) => (
                <option
                  key={v.id_automotor}
                  value={v.id_automotor}
                >{`${v.placa} - ${v.marca || ""} ${v.linea_modelo || ""}`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Policía de tránsito
            </label>
            <select
              name="id_policia_transito"
              value={form.id_policia_transito}
              onChange={handleChange}
              disabled={loadingRefs && !usuarios.length}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Seleccione un policía</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/comparendos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar comparendo"
                : "Crear comparendo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComparendoForm;
