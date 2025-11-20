import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createSecretaria,
  getSecretariaById,
  updateSecretaria,
} from "../../services/secretariasService.js";
import { getMunicipios } from "../../services/municipiosService.js";

const SecretariaForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_secretaria: "",
    direccion: "",
    telefono: "",
    email: "",
    id_municipio: "",
  });

  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Municipios
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        setLoadingRefs(true);
        const data = await getMunicipios();
        const list = data?.municipios || data || [];
        setMunicipios(list);
      } catch (error) {
        console.error("Error cargando municipios:", error);
      } finally {
        setLoadingRefs(false);
      }
    };
    fetchMunicipios();
  }, []);

  // Cargar secretaría en edición
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchSecretaria = async () => {
      setErrorMsg("");
      try {
        const data = await getSecretariaById(id);
        const s = data.secretaria || data;

        setForm({
          nombre_secretaria: s.nombre_secretaria || "",
          direccion: s.direccion || "",
          telefono: s.telefono || "",
          email: s.email || "",
          id_municipio: s.id_municipio ?? "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message || "No se pudo cargar la secretaría";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSecretaria();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        nombre_secretaria: form.nombre_secretaria,
        direccion: form.direccion,
        telefono: form.telefono || null,
        email: form.email || null,
        id_municipio: form.id_municipio ? Number(form.id_municipio) : null,
      };

      if (isEdit) {
        await updateSecretaria(id, payload);
      } else {
        await createSecretaria(payload);
      }

      navigate("/secretarias");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar la secretaría";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando secretaría...
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? "Editar secretaría" : "Nueva secretaría"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Organismo de tránsito responsable de la gestión de movilidad.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la secretaría"
          name="nombre_secretaria"
          value={form.nombre_secretaria}
          onChange={handleChange}
          required
        />

        <Input
          label="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Ej: 6023337700"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contacto@movilidadcali.gov.co"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Municipio
          </label>
          <select
            name="id_municipio"
            value={form.id_municipio}
            onChange={handleChange}
            required
            disabled={loadingRefs && !municipios.length}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Seleccione un municipio...</option>
            {municipios.map((m) => (
              <option key={m.id_municipio} value={m.id_municipio}>
                {m.nombre_municipio}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/secretarias")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecretariaForm;
