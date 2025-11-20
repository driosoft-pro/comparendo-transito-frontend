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

  // Cargar categoría en edición
  useEffect(() => {
    if (!isEdit) return;

    const loadCategoria = async () => {
      try {
        setLoading(true);
        const data = await getCategoriaLicenciaById(id);

        setForm({
          codigo: data.codigo || "",
          descripcion: data.descripcion || "",
        });
      } catch (err) {
        console.error(err);
        setErrorMsg(
          err?.response?.data?.message ||
            "No se pudo cargar la categoría de licencia",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategoria();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

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
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          "No se pudo guardar la categoría de licencia",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando categoría...</p>;

  return (
    <div className="max-w-lg space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        {isEdit
          ? "Editar categoría de licencia"
          : "Nueva categoría de licencia"}
      </h2>

      {errorMsg && (
        <div className="rounded bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-300">
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
          <label className="mb-1 block text-sm">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Motocicletas, motociclos y mototriciclos hasta 125 c.c."
          />
        </div>

        <div className="flex gap-2">
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
