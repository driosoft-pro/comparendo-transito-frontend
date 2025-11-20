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
import { getSecretarias } from "../../services/secretariasService.js";
import {
  getLicenciasCategoria,
  createLicenciaCategoria,
  deleteLicenciaCategoria,
} from "../../services/licenciaCategoriasService.js";

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
  });

  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [secretarias, setSecretarias] = useState([]);

  const [relaciones, setRelaciones] = useState([]);
  const [selectedCategoriasIds, setSelectedCategoriasIds] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [loadingAux, setLoadingAux] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar usuarios, categorías, secretarías y relaciones
  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        setLoadingAux(true);

        const [usersResp, categoriasResp, secretariasResp, relResp] =
          await Promise.all([
            getUsers(),
            getCategoriasLicencia(),
            getSecretarias(),
            getLicenciasCategoria(),
          ]);

        setUsuarios(usersResp?.usuarios || usersResp || []);
        setCategorias(categoriasResp || []);
        setSecretarias(secretariasResp || []);

        if (isEdit && relResp) {
          const allRel = relResp || [];
          const relForLic = allRel.filter(
            (r) => Number(r.id_licencia_conduccion) === Number(id),
          );
          setRelaciones(relForLic);
          setSelectedCategoriasIds(
            relForLic.map((r) => String(r.id_categoria_licencia)),
          );
        }
      } catch (error) {
        console.error("Error cargando catálogos:", error);
      } finally {
        setLoadingAux(false);
      }
    };

    fetchAuxData();
  }, [id, isEdit]);

  // Cargar licencia si es edición
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const fetchLicencia = async () => {
      setErrorMsg("");
      try {
        const data = await getLicenciaById(id);
        const l = data.licencia || data;

        setForm({
          numero_licencia: l.numero_licencia || "",
          fecha_expedicion: l.fecha_expedicion || "",
          fecha_vencimiento: l.fecha_vencimiento || "",
          organismo_transito_expedidor: l.organismo_transito_expedidor || "",
          estado: l.estado || "ACTIVA",
          id_persona: l.id_persona ?? "",
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message || "No se pudo cargar la licencia";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchLicencia();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_persona") {
      setForm((prev) => ({
        ...prev,
        [name]: value ? Number(value) : "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoriasChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value,
    );
    setSelectedCategoriasIds(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const payloadLicencia = {
        numero_licencia: form.numero_licencia,
        fecha_expedicion: form.fecha_expedicion,
        fecha_vencimiento: form.fecha_vencimiento,
        organismo_transito_expedidor: form.organismo_transito_expedidor,
        estado: form.estado,
        id_persona: form.id_persona || null,
      };

      let idLicencia;

      if (isEdit) {
        const updated = await updateLicencia(id, payloadLicencia);
        idLicencia =
          updated.id_licencia || updated.id_licencia_conduccion || Number(id);

        const seleccionadasNum = selectedCategoriasIds.map((v) => Number(v));
        const existentesNum = relaciones.map((r) =>
          Number(r.id_categoria_licencia),
        );

        const toDelete = relaciones.filter(
          (r) => !seleccionadasNum.includes(Number(r.id_categoria_licencia)),
        );
        await Promise.all(
          toDelete.map((r) => deleteLicenciaCategoria(r.id_licencia_categoria)),
        );

        const toCreate = seleccionadasNum.filter(
          (catId) => !existentesNum.includes(catId),
        );
        const today = new Date().toISOString().slice(0, 10);

        await Promise.all(
          toCreate.map((catId) =>
            createLicenciaCategoria({
              id_licencia_conduccion: idLicencia,
              id_categoria_licencia: catId,
              fecha_asignacion: today,
            }),
          ),
        );
      } else {
        const creada = await createLicencia(payloadLicencia);
        idLicencia =
          creada.id_licencia || creada.id_licencia_conduccion || null;

        if (!idLicencia) {
          throw new Error("No se obtuvo el id de la licencia creada");
        }

        const seleccionadasNum = selectedCategoriasIds.map((v) => Number(v));
        const today = new Date().toISOString().slice(0, 10);

        await Promise.all(
          seleccionadasNum.map((catId) =>
            createLicenciaCategoria({
              id_licencia_conduccion: idLicencia,
              id_categoria_licencia: catId,
              fecha_asignacion: today,
            }),
          ),
        );
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

  if (loading || loadingAux) {
    return <p>Cargando datos de licencia...</p>;
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
              required
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
              required
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Organismo = Secretarías */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Organismo de tránsito expedidor
          </label>
          <select
            name="organismo_transito_expedidor"
            value={form.organismo_transito_expedidor}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Seleccione una secretaría...</option>
            {secretarias.map((s) => (
              <option key={s.id_secretaria} value={s.nombre_secretaria}>
                {s.nombre_secretaria}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Estado */}
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

          {/* Persona */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Persona (usuario)
            </label>
            <select
              name="id_persona"
              value={form.id_persona}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Seleccione una persona...</option>
              {usuarios.map((u) => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categorías (multi) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Categorías de licencia
          </label>
          <p className="mb-1 text-[11px] text-slate-500 dark:text-slate-400">
            Usa Ctrl/Cmd para seleccionar varias categorías si aplica.
          </p>
          <select
            multiple
            value={selectedCategoriasIds}
            onChange={handleCategoriasChange}
            className="block max-h-40 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
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
