import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPerfil,
  getPerfilById,
  updatePerfil,
} from "../../services/perfilesService.js";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";

const PerfilForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    tipo_doc: "CC",
    num_doc: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fecha_nacimiento: "",
    genero: "M",
    direccion: "",
    telefono: "",
    email: "",
    id_municipio: "",
    id_licencia_conduccion: "",
    id_usuario: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // helper para normalizar género que viene del backend
  const normalizeGenero = (g) => {
    if (!g) return "M";
    const val = g.toString().toLowerCase();
    if (val === "masculino" || val === "m") return "M";
    if (val === "femenino" || val === "f") return "F";
    return "OTRO";
  };

  // helper para enviar género como espera el backend
  const toBackendGenero = (g) => {
    if (g === "M") return "Masculino";
    if (g === "F") return "Femenino";
    return "Otro";
  };

  useEffect(() => {
    if (isEdit) {
      const fetchPerfil = async () => {
        try {
          setLoading(true);
          setError("");
          const p = await getPerfilById(id);

          setForm({
            tipo_doc: p.tipo_doc || "CC",
            num_doc: p.num_doc || "",
            primer_nombre: p.primer_nombre || "",
            segundo_nombre: p.segundo_nombre || "",
            primer_apellido: p.primer_apellido || "",
            segundo_apellido: p.segundo_apellido || "",
            fecha_nacimiento: p.fecha_nacimiento || "",
            genero: normalizeGenero(p.genero),
            direccion: p.direccion || "",
            telefono: p.telefono || "",
            email: p.email || "",
            id_municipio: p.id_municipio ?? "",
            id_licencia_conduccion: p.id_licencia_conduccion ?? "",
            id_usuario: p.id_usuario ?? "",
          });
        } catch (err) {
          console.error("Error cargando perfil:", err);
          setError(
            err?.response?.data?.message || "No se pudo cargar el perfil",
          );
        } finally {
          setLoading(false);
        }
      };
      fetchPerfil();
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
        genero: toBackendGenero(form.genero),
        id_municipio: form.id_municipio ? parseInt(form.id_municipio) : null,
        id_licencia_conduccion: form.id_licencia_conduccion
          ? parseInt(form.id_licencia_conduccion)
          : null,
        id_usuario: form.id_usuario ? parseInt(form.id_usuario) : null,
      };

      if (isEdit) {
        await updatePerfil(id, payload);
      } else {
        await createPerfil(payload);
      }
      navigate("/perfiles");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError(err?.response?.data?.message || "No se pudo guardar el perfil");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-600 dark:text-slate-300">
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar perfil" : "Nuevo perfil"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Completa los datos personales del ciudadano.
          </p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Button variant="secondary" onClick={() => navigate("/perfiles")}>
            Volver
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
      >
        {/* Identificación */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              1
            </span>
            Identificación
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipo de documento *
              </label>
              <select
                name="tipo_doc"
                value={form.tipo_doc}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="PA">Pasaporte</option>
              </select>
            </div>

            <Input
              label="Número de documento *"
              name="num_doc"
              value={form.num_doc}
              onChange={handleChange}
              placeholder="Ej: 1234567890"
              required
            />
          </div>
        </div>

        {/* Datos personales */}
        <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              2
            </span>
            Datos personales
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Primer nombre *"
              name="primer_nombre"
              value={form.primer_nombre}
              onChange={handleChange}
              placeholder="Primer nombre"
              required
            />

            <Input
              label="Segundo nombre"
              name="segundo_nombre"
              value={form.segundo_nombre}
              onChange={handleChange}
              placeholder="Segundo nombre (opcional)"
            />

            <Input
              label="Primer apellido *"
              name="primer_apellido"
              value={form.primer_apellido}
              onChange={handleChange}
              placeholder="Primer apellido"
              required
            />

            <Input
              label="Segundo apellido"
              name="segundo_apellido"
              value={form.segundo_apellido}
              onChange={handleChange}
              placeholder="Segundo apellido (opcional)"
            />

            <Input
              label="Fecha de nacimiento *"
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Género *
              </label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              3
            </span>
            Información de contacto
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Dirección *"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección completa de residencia"
                required
              />
            </div>

            <Input
              label="Teléfono *"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
              required
            />

            <Input
              label="Email *"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
        </div>

        {/* Referencias */}
        <div className="mb-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              4
            </span>
            Referencias del sistema
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="ID municipio *"
              name="id_municipio"
              type="number"
              value={form.id_municipio}
              onChange={handleChange}
              placeholder="ID del municipio"
              required
            />

            <Input
              label="ID licencia de conducción"
              name="id_licencia_conduccion"
              type="number"
              value={form.id_licencia_conduccion}
              onChange={handleChange}
              placeholder="ID de licencia (opcional)"
            />

            <Input
              label="ID usuario"
              name="id_usuario"
              type="number"
              value={form.id_usuario}
              onChange={handleChange}
              placeholder="ID de usuario (opcional)"
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            * Los campos de referencia deben corresponder a IDs válidos en el
            sistema.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/perfiles")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar perfil"
                : "Crear perfil"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PerfilForm;
