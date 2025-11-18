import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  getMunicipioById,
  createMunicipio,
  updateMunicipio,
} from "../../services/municipiosService.js";
import { getSecretarias } from "../../services/secretariaService.js";

const MunicipioForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombre_municipio: "",
    departamento: "",
    codigo_dane: "",
    direccion_oficina_principal: "",
    id_secretaria_transito: "",
  });

  const [secretarias, setSecretarias] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cargar secretarías
  useEffect(() => {
    const fetchSecretarias = async () => {
      try {
        setLoadingRefs(true);
        const data = await getSecretarias();
        const list = Array.isArray(data)
          ? data
          : data?.secretarias || data?.data || [];
        setSecretarias(list);
      } catch (err) {
        console.error("Error cargando secretarías:", err);
      } finally {
        setLoadingRefs(false);
      }
    };

    fetchSecretarias();
  }, []);

  // Cargar municipio si es edición
  useEffect(() => {
    if (!isEdit) return;

    const fetchMunicipio = async () => {
      try {
        setLoading(true);
        setError("");
        const m = await getMunicipioById(id);

        if (!m || typeof m !== "object") {
          setError("No se encontró el municipio");
          return;
        }

        setForm({
          nombre_municipio: m.nombre_municipio || "",
          departamento: m.departamento || "",
          codigo_dane: m.codigo_dane || "",
          direccion_oficina_principal: m.direccion_oficina_principal || "",
          id_secretaria_transito: m.id_secretaria_transito ?? "",
        });
      } catch (err) {
        console.error("Error cargando municipio:", err);
        setError("No se pudo cargar el municipio");
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipio();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      id_secretaria_transito: form.id_secretaria_transito
        ? Number(form.id_secretaria_transito)
        : null,
    };

    try {
      if (isEdit) {
        await updateMunicipio(id, payload);
      } else {
        await createMunicipio(payload);
      }
      navigate("/municipios");
    } catch (err) {
      console.error("Error guardando municipio:", err);
      setError("No se pudo guardar el municipio");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando municipio...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar municipio" : "Nuevo municipio"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Información del municipio y su secretaría 🗺️
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/municipios")}>
          Volver
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <Input
          label="Nombre del municipio"
          name="nombre_municipio"
          value={form.nombre_municipio}
          onChange={handleChange}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Departamento"
            name="departamento"
            value={form.departamento}
            onChange={handleChange}
            required
          />
          <Input
            label="Código DANE"
            name="codigo_dane"
            value={form.codigo_dane}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Dirección oficina principal"
          name="direccion_oficina_principal"
          value={form.direccion_oficina_principal}
          onChange={handleChange}
          required
        />

        {/* Select de secretaría */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Secretaría de tránsito
          </label>
          <select
            name="id_secretaria_transito"
            value={form.id_secretaria_transito}
            onChange={handleChange}
            disabled={loadingRefs && !secretarias.length}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Seleccione una secretaría...</option>
            {secretarias.map((s) => (
              <option key={s.id_secretaria} value={s.id_secretaria}>
                {s.nombre_secretaria}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/municipios")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar municipio"
                : "Registrar municipio"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MunicipioForm;
