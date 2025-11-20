import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getInfraccionById,
  createInfraccion,
  updateInfraccion,
} from "../../services/infraccionesService.js";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";

const InfraccionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    codigo_infraccion: "",
    descripcion: "",
    tipo_infraccion: "",
    valor_base: "",
    puntos_descuento: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchInfraccion = async () => {
      setErrorMsg("");
      try {
        const inf = await getInfraccionById(id); // ya viene normalizado

        if (!inf || !inf.id_infraccion) {
          setErrorMsg("Infracción no encontrada");
          return;
        }

        setForm({
          codigo_infraccion: inf.codigo_infraccion || "",
          descripcion: inf.descripcion || "",
          tipo_infraccion: inf.tipo_infraccion || "",
          valor_base:
            inf.valor_base !== undefined && inf.valor_base !== null
              ? String(inf.valor_base)
              : "",
          puntos_descuento:
            inf.puntos_descuento !== undefined && inf.puntos_descuento !== null
              ? String(inf.puntos_descuento)
              : "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message ||
          `Error obteniendo infracción (código ${
            error?.response?.status || "desconocido"
          })`;
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchInfraccion();
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
    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        codigo_infraccion: form.codigo_infraccion.trim(),
        descripcion: form.descripcion.trim(),
        tipo_infraccion: form.tipo_infraccion.trim(),
        valor_base: form.valor_base === "" ? null : Number(form.valor_base),
        puntos_descuento:
          form.puntos_descuento === "" ? null : Number(form.puntos_descuento),
      };

      if (isEdit) {
        await updateInfraccion(id, payload);
      } else {
        await createInfraccion(payload);
      }

      navigate("/infracciones");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar la infracción";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando infracción...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar infracción" : "Nueva infracción"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configura los datos de la infracción y su valor base.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/infracciones")}>
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
        {/* Código + Tipo */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Código infracción"
            name="codigo_infraccion"
            value={form.codigo_infraccion}
            onChange={handleChange}
            placeholder="Ej: C01"
            required
          />
          <Input
            label="Tipo de infracción"
            name="tipo_infraccion"
            value={form.tipo_infraccion}
            onChange={handleChange}
            placeholder="Leve, Grave..."
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Descripción detallada de la conducta infractora..."
            required
          />
        </div>

        {/* Valor base + puntos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Valor base (COP)"
            name="valor_base"
            type="number"
            value={form.valor_base}
            onChange={handleChange}
            placeholder="Ej: 234000"
            min="0"
            required
          />
          <Input
            label="Puntos de descuento"
            name="puntos_descuento"
            type="number"
            value={form.puntos_descuento}
            onChange={handleChange}
            placeholder="Ej: 2"
            min="0"
          />
        </div>

        {/* Footer botones */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/infracciones")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar infracción"
                : "Crear infracción"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfraccionForm;
