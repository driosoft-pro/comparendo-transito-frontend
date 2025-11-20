import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createMunicipio,
  getMunicipioById,
  updateMunicipio,
} from "../../services/municipiosService.js";
import { getSecretarias } from "../../services/secretariasService.js";

const MunicipioForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

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
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar secretarías
  useEffect(() => {
    const fetchSecretarias = async () => {
      try {
        setLoadingRefs(true);
        const data = await getSecretarias();
        const list = data?.secretarias || data?.registros || data || [];
        setSecretarias(list);
      } catch (error) {
        console.error("Error cargando secretarías:", error);
      } finally {
        setLoadingRefs(false);
      }
    };

    fetchSecretarias();
  }, []);

  // Cargar municipio si es edición
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchMunicipio = async () => {
      setErrorMsg("");
      try {
        const data = await getMunicipioById(id);
        const m = data.municipio || data;

        setForm({
          nombre_municipio: m.nombre_municipio || "",
          departamento: m.departamento || "",
          codigo_dane: m.codigo_dane || "",
          direccion_oficina_principal: m.direccion_oficina_principal || "",
          // si el backend aún no tiene este campo, simplemente quedará vacío
          id_secretaria_transito: m.id_secretaria_transito ?? "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message || "No se pudo cargar el municipio";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipio();
  }, [id, isEdit]);

  // ✅ AQUÍ estaba el error de sintaxis: faltaba el value
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
        nombre_municipio: form.nombre_municipio,
        departamento: form.departamento,
        codigo_dane: form.codigo_dane,
        direccion_oficina_principal: form.direccion_oficina_principal,
        id_secretaria_transito: form.id_secretaria_transito
          ? Number(form.id_secretaria_transito)
          : null,
      };

      if (isEdit) {
        await updateMunicipio(id, payload);
      } else {
        await createMunicipio(payload);
      }

      navigate("/municipios");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar el municipio";
      setErrorMsg(msg);
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
    <div className="max-w-3xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? "Editar municipio" : "Nuevo municipio"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Datos del municipio y su secretaría de tránsito asociada.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Secretaría relacionada */}
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
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Si el backend aún no guarda este vínculo, simplemente ignorará este
            campo.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
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
                : "Crear municipio"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MunicipioForm;
