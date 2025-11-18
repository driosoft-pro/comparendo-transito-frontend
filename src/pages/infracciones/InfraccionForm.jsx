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

  useEffect(() => {
    if (!isEdit) return;

    const loadData = async () => {
      setLoading(true);
      const data = await getInfraccionById(id);

      setForm({
        codigo_infraccion: data.codigo_infraccion || "",
        descripcion: data.descripcion || "",
        tipo_infraccion: data.tipo_infraccion || "",
        valor_base: data.valor_base || "",
        puntos_descuento: data.puntos_descuento || "",
      });

      setLoading(false);
    };

    loadData();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) await updateInfraccion(id, form);
      else await createInfraccion(form);

      navigate("/infracciones");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <p className="py-6 text-center">Cargando infracción...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">
          {isEdit ? "Editar infracción" : "Nueva infracción"}
        </h2>
        <Button onClick={() => navigate("/infracciones")} variant="secondary">
          Volver
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border p-4 dark:border-slate-700 dark:bg-slate-900"
      >
        <Input
          label="Código"
          name="codigo_infraccion"
          value={form.codigo_infraccion}
          onChange={handleChange}
          required
        />
        <Input
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <Input
          label="Tipo de infracción"
          name="tipo_infraccion"
          value={form.tipo_infraccion}
          onChange={handleChange}
          required
        />
        <Input
          label="Valor base"
          name="valor_base"
          value={form.valor_base}
          type="number"
          onChange={handleChange}
          required
        />
        <Input
          label="Puntos descuento"
          name="puntos_descuento"
          type="number"
          value={form.puntos_descuento}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
          <Button variant="secondary" onClick={() => navigate("/infracciones")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfraccionForm;
