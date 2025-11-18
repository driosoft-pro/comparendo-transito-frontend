import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createComparendo,
  getComparendoById,
  updateComparendo,
} from "../../services/comparendosService.js";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";

const ComparendoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

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

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchComparendo = async () => {
        try {
          setLoading(true);
          const data = await getComparendoById(id);
          setForm({
            numero_comparendo: data.numero_comparendo || "",
            fecha_hora_registro: data.fecha_hora_registro
              ? new Date(data.fecha_hora_registro).toISOString().slice(0, 16)
              : "",
            direccion_infraccion: data.direccion_infraccion || "",
            coordenadas_gps: data.coordenadas_gps || "",
            observaciones: data.observaciones || "",
            estado: data.estado || "PENDIENTE",
            id_municipio: data.id_municipio || "",
            id_persona: data.id_persona || "",
            id_licencia_conduccion: data.id_licencia_conduccion || "",
            id_policia_transito: data.id_policia_transito || "",
            id_automotor: data.id_automotor || "",
          });
        } catch (err) {
          console.error("Error cargando comparendo:", err);
          setError("No se pudo cargar el comparendo");
        } finally {
          setLoading(false);
        }
      };
      fetchComparendo();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        id_municipio: form.id_municipio ? parseInt(form.id_municipio) : null,
        id_persona: form.id_persona ? parseInt(form.id_persona) : null,
        id_licencia_conduccion: form.id_licencia_conduccion
          ? parseInt(form.id_licencia_conduccion)
          : null,
        id_policia_transito: form.id_policia_transito
          ? parseInt(form.id_policia_transito)
          : null,
        id_automotor: form.id_automotor ? parseInt(form.id_automotor) : null,
      };

      if (isEdit) {
        await updateComparendo(id, payload);
      } else {
        await createComparendo(payload);
      }
      navigate("/comparendos");
    } catch (err) {
      console.error("Error guardando comparendo:", err);
      setError(
        err?.response?.data?.message || "No se pudo guardar el comparendo",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-300">
          Cargando comparendo...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar Comparendo" : "Nuevo Comparendo"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete los datos del comparendo de tránsito
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/comparendos")}>
          Volver
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Número de comparendo *"
            name="numero_comparendo"
            value={form.numero_comparendo}
            onChange={handleChange}
            placeholder="Ej: CT-2025-001234"
            required
          />

          <Input
            label="Fecha y Hora *"
            name="fecha_hora_registro"
            type="datetime-local"
            value={form.fecha_hora_registro}
            onChange={handleChange}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Dirección de la infracción *"
              name="direccion_infraccion"
              value={form.direccion_infraccion}
              onChange={handleChange}
              placeholder="Dirección exacta donde se cometió la infracción"
              required
            />
          </div>

          <Input
            label="Coordenadas GPS"
            name="coordenadas_gps"
            value={form.coordenadas_gps}
            onChange={handleChange}
            placeholder="Latitud, Longitud"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Estado *
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              required
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADO">Pagado</option>
              <option value="ANULADO">Anulado</option>
              <option value="EN_PROCESO">En Proceso</option>
            </select>
          </div>

          <Input
            label="ID Municipio *"
            name="id_municipio"
            type="number"
            value={form.id_municipio}
            onChange={handleChange}
            placeholder="ID del municipio"
            required
          />

          <Input
            label="ID Persona (Infractor)"
            name="id_persona"
            type="number"
            value={form.id_persona}
            onChange={handleChange}
            placeholder="ID de la persona infractora"
          />

          <Input
            label="ID Licencia de Conducción"
            name="id_licencia_conduccion"
            type="number"
            value={form.id_licencia_conduccion}
            onChange={handleChange}
            placeholder="ID de la licencia"
          />

          <Input
            label="ID Policía de Tránsito *"
            name="id_policia_transito"
            type="number"
            value={form.id_policia_transito}
            onChange={handleChange}
            placeholder="ID del policía que registra"
            required
          />

          <Input
            label="ID Automotor (Vehículo) *"
            name="id_automotor"
            type="number"
            value={form.id_automotor}
            onChange={handleChange}
            placeholder="ID del vehículo"
            required
          />

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Descripción detallada de la infracción y circunstancias"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
                ? "Actualizar"
                : "Crear Comparendo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComparendoForm;
