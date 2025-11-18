import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createLicencia,
  getLicenciaById,
  updateLicencia,
} from "../../services/licenciasService.js";
import { getUsers } from "../../services/usersService.js";
import { getCategoriasLicencia } from "../../services/categoriasLicenciaService.js";

const LicenciaForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    numero_licencia: "",
    fecha_expedicion: "",
    fecha_vencimiento: "",
    organismo_transito_expedidor: "",
    estado: "ACTIVA",
    id_persona: "",
    id_categoria: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setErrorMsg("");
      setLoading(true);
      try {
        const [usersResp, categoriasResp, licenciaResp] = await Promise.all([
          getUsers(),
          getCategoriasLicencia(),
          isEdit ? getLicenciaById(id) : Promise.resolve(null),
        ]);

        // Usuarios
        const usuariosList = usersResp?.usuarios || [];
        setUsuarios(usuariosList);

        // Categorías
        setCategorias(categoriasResp || []);

        // Licencia (si es edición)
        if (isEdit && licenciaResp) {
          const l = licenciaResp.licencia || licenciaResp;
          setForm({
            numero_licencia: l.numero_licencia || "",
            fecha_expedicion: l.fecha_expedicion || "",
            fecha_vencimiento: l.fecha_vencimiento || "",
            organismo_transito_expedidor: l.organismo_transito_expedidor || "",
            estado: l.estado || "ACTIVA",
            id_persona: l.id_persona ?? "",
            id_categoria: l.id_categoria ?? "",
          });
        }
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message ||
          "No se pudieron cargar los datos de la licencia";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "id_persona" || name === "id_categoria"
          ? Number(value) || ""
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        numero_licencia: form.numero_licencia,
        fecha_expedicion: form.fecha_expedicion,
        fecha_vencimiento: form.fecha_vencimiento,
        organismo_transito_expedidor: form.organismo_transito_expedidor,
        estado: form.estado,
        id_persona: form.id_persona,
        id_categoria: form.id_categoria,
      };

      if (isEdit) {
        await updateLicencia(id, payload);
      } else {
        await createLicencia(payload);
      }

      navigate("/licencias");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar la licencia";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Cargando licencia...</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? "Editar licencia" : "Nueva licencia"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Modifica los datos de la licencia seleccionada."
            : "Registra una nueva licencia de conducción."}
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Número de licencia"
          name="numero_licencia"
          value={form.numero_licencia}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha de expedición
            </label>
            <input
              type="date"
              name="fecha_expedicion"
              value={form.fecha_expedicion}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              name="fecha_vencimiento"
              value={form.fecha_vencimiento}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>
        </div>

        <Input
          label="Organismo de tránsito expedidor"
          name="organismo_transito_expedidor"
          value={form.organismo_transito_expedidor}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="ACTIVA">ACTIVA</option>
              <option value="SUSPENDIDA">SUSPENDIDA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>

          {/* Persona (usuario) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Persona (usuario)
            </label>
            <select
              name="id_persona"
              value={form.id_persona}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Seleccione una persona</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categoría de licencia */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Categoría de licencia
          </label>
          <select
            name="id_categoria"
            value={form.id_categoria}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.codigo} - {c.descripcion}
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
            onClick={() => navigate("/licencias")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LicenciaForm;
