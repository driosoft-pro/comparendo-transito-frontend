import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createQueja,
  getQuejaById,
  updateQueja,
} from "../../services/quejasService.js";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";

const QuejaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    fecha_radicacion: "",
    texto_queja: "",
    estado: "RADICADA",
    medio_radicacion: "WEB",
    respuesta: "",
    fecha_respuesta: "",
    id_comparendo: "",
    id_persona: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchQueja = async () => {
        try {
          setLoading(true);
          const data = await getQuejaById(id);
          setForm({
            fecha_radicacion: data.fecha_radicacion
              ? new Date(data.fecha_radicacion).toISOString().slice(0, 16)
              : "",
            texto_queja: data.texto_queja || "",
            estado: data.estado || "RADICADA",
            medio_radicacion: data.medio_radicacion || "WEB",
            respuesta: data.respuesta || "",
            fecha_respuesta: data.fecha_respuesta
              ? new Date(data.fecha_respuesta).toISOString().slice(0, 16)
              : "",
            id_comparendo: data.id_comparendo || "",
            id_persona: data.id_persona || "",
          });
        } catch (err) {
          console.error("Error cargando queja:", err);
          setError("No se pudo cargar la queja");
        } finally {
          setLoading(false);
        }
      };
      fetchQueja();
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
        id_comparendo: form.id_comparendo ? parseInt(form.id_comparendo) : null,
        id_persona: form.id_persona ? parseInt(form.id_persona) : null,
        fecha_respuesta: form.fecha_respuesta || null,
      };

      if (isEdit) {
        await updateQueja(id, payload);
      } else {
        await createQueja(payload);
      }
      navigate("/quejas");
    } catch (err) {
      console.error("Error guardando queja:", err);
      setError(err?.response?.data?.message || "No se pudo guardar la queja");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-300">
          Cargando queja...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar Queja" : "Nueva Queja"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEdit
              ? "Actualice los datos de la queja o agregue una respuesta"
              : "Registre una nueva queja o reclamo ciudadano"}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/quejas")}>
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
        {/* Sección: Información Básica */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              1
            </span>
            Información Básica
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Fecha y Hora de Radicación *"
              name="fecha_radicacion"
              type="datetime-local"
              value={form.fecha_radicacion}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Medio de Radicación *
              </label>
              <select
                name="medio_radicacion"
                value={form.medio_radicacion}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
              >
                <option value="WEB">Web</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="TELEFONO">Teléfono</option>
                <option value="EMAIL">Email</option>
                <option value="CORREO_FISICO">Correo Físico</option>
              </select>
            </div>

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
                <option value="RADICADA">Radicada</option>
                <option value="EN_REVISION">En Revisión</option>
                <option value="RESUELTA">Resuelta</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección: Referencias */}
        <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              2
            </span>
            Referencias
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="ID Comparendo *"
              name="id_comparendo"
              type="number"
              value={form.id_comparendo}
              onChange={handleChange}
              placeholder="ID del comparendo relacionado"
              required
            />

            <Input
              label="ID Persona (Quejoso) *"
              name="id_persona"
              type="number"
              value={form.id_persona}
              onChange={handleChange}
              placeholder="ID de la persona que presenta la queja"
              required
            />
          </div>
        </div>

        {/* Sección: Contenido de la Queja */}
        <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              3
            </span>
            Contenido de la Queja
          </h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Texto de la Queja *
            </label>
            <textarea
              name="texto_queja"
              value={form.texto_queja}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Describa detalladamente el motivo de la queja..."
              required
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sea claro y específico sobre los motivos de la queja
            </p>
          </div>
        </div>

        {/* Sección: Respuesta (solo si está en edición) */}
        {isEdit && (
          <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                4
              </span>
              Respuesta de la Entidad
            </h3>
            <div className="space-y-4">
              <Input
                label="Fecha y Hora de Respuesta"
                name="fecha_respuesta"
                type="datetime-local"
                value={form.fecha_respuesta}
                onChange={handleChange}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Texto de la Respuesta
                </label>
                <textarea
                  name="respuesta"
                  value={form.respuesta}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="Respuesta oficial de la entidad a la queja presentada..."
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Complete este campo cuando se haya dado respuesta a la queja
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/quejas")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar Queja"
                : "Crear Queja"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuejaForm;
