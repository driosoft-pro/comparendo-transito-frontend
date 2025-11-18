import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createCategoriaLicencia,
  getCategoriaLicenciaById,
  updateCategoriaLicencia,
} from "../../services/categoriasLicenciaService.js";

const CategoriaLicenciaForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigo: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCategoria = async () => {
      setErrorMsg("");
      try {
        const data = await getCategoriaLicenciaById(id);
        const c = data.categoria || data.categoria_licencia || data;
        setForm({
          codigo: c.codigo || "",
          descripcion: c.descripcion || "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message ||
          "No se pudo cargar la categoría de licencia";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchCategoria();
    }
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
        codigo: form.codigo,
        descripcion: form.descripcion,
      };

      if (isEdit) {
        await updateCategoriaLicencia(id, payload);
      } else {
        await createCategoriaLicencia(payload);
      }

      navigate("/categorias-licencia");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        "No se pudo guardar la categoría de licencia";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Cargando categoría...</p>;
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit
            ? "Editar categoría de licencia"
            : "Nueva categoría de licencia"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Modifica los datos de la categoría seleccionada."
            : "Crea una nueva categoría de licencia (A1, A2, B1, C2, etc.)."}
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código"
          name="codigo"
          placeholder="Ej: A1"
          value={form.codigo}
          onChange={handleChange}
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            rows={3}
            placeholder="Motocicletas, motociclos y mototriciclos hasta 125 c.c."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/categorias-licencia")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaLicenciaForm;
