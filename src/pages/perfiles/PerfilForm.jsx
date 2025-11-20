import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPerfil,
  getPerfilById,
  updatePerfil,
} from "../../services/perfilesService.js";
import { getMunicipios } from "../../services/municipiosService.js";
import { getLicencias } from "../../services/licenciasService.js";
import { getUsers } from "../../services/usersService.js";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";

const DOC_TYPES = [
  {
    label: "Cédula de Ciudadanía",
    value: "CC",
    description:
      "Documento de identificación nacional (comúnmente usado en Colombia, Ecuador, etc.).",
  },
  {
    label: "Tarjeta de Identidad",
    value: "TI",
    description: "Documento de identificación para menores de edad.",
  },
  {
    label: "Cédula de Extranjería",
    value: "CE",
    description: "Documento de identificación para extranjeros residentes.",
  },
  {
    label: "Pasaporte",
    value: "PS",
    description: "Documento oficial de viaje e identificación internacional.",
  },
  {
    label: "Registro Civil",
    value: "RC",
    description: "Documento que certifica el nacimiento de una persona.",
  },
  {
    label: "Permiso Especial de Permanencia",
    value: "PEP",
    description:
      "Documento temporal para migrantes (comúnmente usado en Venezuela, Colombia, Perú, etc.).",
  },
  {
    label: "Número de Identificación Tributaria",
    value: "NIT",
    description: "Identificación para personas jurídicas o empresas.",
  },
  {
    label: "Otros",
    value: "OT",
    description: "Categoría de documentos no listados anteriormente.",
  },
];

// ---------------------
// Select con filtro integrado
// ---------------------
const FilterableSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccione...",
  disabled = false,
  required = false,
  getOptionLabel = (o) => o.label,
  getOptionValue = (o) => o.value,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = options.find(
    (opt) => String(getOptionValue(opt)) === String(value),
  );

  const filtered = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (opt) => {
    const val = getOptionValue(opt);
    onChange({
      target: { name, value: String(val) },
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Campo "tipo select" */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100 ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500"
            : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800"
        }`}
      >
        <span className="truncate">
          {selected ? getOptionLabel(selected) : placeholder}
        </span>
        <span className="ml-2 inline-block text-xs text-slate-400">▾</span>
      </button>

      {/* input oculto para que HTML5 valide required */}
      <input
        type="hidden"
        name={name}
        value={value || ""}
        required={required}
      />

      {open && !disabled && (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-2 py-1 dark:border-slate-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="max-h-60 overflow-y-auto text-sm">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
                Sin resultados
              </div>
            )}
            {filtered.map((opt) => {
              const optVal = getOptionValue(opt);
              const isSelected = String(optVal) === String(value);
              return (
                <button
                  type="button"
                  key={optVal}
                  onClick={() => handleSelect(opt)}
                  className={`flex w-full items-start px-3 py-2 text-left ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{getOptionLabel(opt)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------
// Helpers género / main
// ---------------------
const normalizeGenero = (g) => {
  if (!g) return "M";
  const v = String(g).toLowerCase();
  if (v === "masculino" || v === "m") return "M";
  if (v === "femenino" || v === "f") return "F";
  return "OTRO";
};

const toBackendGenero = (g) => {
  if (g === "M") return "Masculino";
  if (g === "F") return "Femenino";
  return "Otro";
};

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

  const [municipios, setMunicipios] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cargar catálogos
  useEffect(() => {
    const fetchRefs = async () => {
      try {
        setLoadingRefs(true);

        const [munRes, licRes, usrRes] = await Promise.all([
          getMunicipios(),
          getLicencias(),
          getUsers(),
        ]);

        const munList = Array.isArray(munRes)
          ? munRes
          : munRes?.municipios || [];
        const licList = Array.isArray(licRes)
          ? licRes
          : licRes?.licencias || [];
        const usrList = Array.isArray(usrRes) ? usrRes : usrRes?.usuarios || [];

        setMunicipios(munList);
        setLicencias(licList);
        setUsuarios(usrList);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      } finally {
        setLoadingRefs(false);
      }
    };

    fetchRefs();
  }, []);

  // Cargar perfil en edición
  useEffect(() => {
    if (!isEdit) return;

    const fetchPerfil = async () => {
      try {
        setLoading(true);
        setError("");
        const p = await getPerfilById(id);

        if (!p || typeof p !== "object") {
          setError("No se encontró el perfil");
          return;
        }

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
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...form,
        genero: toBackendGenero(form.genero),
        id_municipio: form.id_municipio ? Number(form.id_municipio) : null,
        id_licencia_conduccion: form.id_licencia_conduccion
          ? Number(form.id_licencia_conduccion)
          : null,
        id_usuario: form.id_usuario ? Number(form.id_usuario) : null,
      };

      if (isEdit) {
        await updatePerfil(id, payload);
      } else {
        await createPerfil(payload);
      }

      navigate("/perfiles");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError("No se pudo guardar el perfil");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar perfil" : "Nuevo perfil"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Datos del ciudadano 🪪
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/perfiles")}>
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
        {/* Identificación */}
        <div className="grid gap-4 md:grid-cols-2">
          <FilterableSelect
            label="Tipo documento"
            name="tipo_doc"
            value={form.tipo_doc}
            onChange={handleChange}
            options={DOC_TYPES}
            placeholder="Tipo de documento..."
            getOptionLabel={(d) => `${d.label} (${d.value}) - ${d.description}`}
            getOptionValue={(d) => d.value}
          />

          <Input
            label="Número documento"
            name="num_doc"
            value={form.num_doc}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nombres y apellidos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Primer nombre"
            name="primer_nombre"
            value={form.primer_nombre}
            onChange={handleChange}
            required
          />
          <Input
            label="Segundo nombre"
            name="segundo_nombre"
            value={form.segundo_nombre}
            onChange={handleChange}
          />
          <Input
            label="Primer apellido"
            name="primer_apellido"
            value={form.primer_apellido}
            onChange={handleChange}
            required
          />
          <Input
            label="Segundo apellido"
            name="segundo_apellido"
            value={form.segundo_apellido}
            onChange={handleChange}
          />
        </div>

        {/* Fecha + género */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Fecha de nacimiento"
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            required
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Género
            </label>
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        {/* Contacto */}
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
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Referencias con selects filtrables */}
        <div className="grid gap-4 md:grid-cols-3">
          <FilterableSelect
            label="Municipio"
            name="id_municipio"
            value={form.id_municipio}
            onChange={handleChange}
            options={municipios}
            placeholder="Seleccione un municipio..."
            required
            disabled={loadingRefs && !municipios.length}
            getOptionLabel={(m) => m.nombre_municipio}
            getOptionValue={(m) => m.id_municipio}
          />

          <FilterableSelect
            label="Licencia de conducción"
            name="id_licencia_conduccion"
            value={form.id_licencia_conduccion}
            onChange={handleChange}
            options={licencias}
            placeholder="Sin licencia asociada"
            disabled={loadingRefs && !licencias.length}
            getOptionLabel={(l) => l.numero_licencia}
            getOptionValue={(l) => l.id_licencia}
          />

          <FilterableSelect
            label="Usuario del sistema"
            name="id_usuario"
            value={form.id_usuario}
            onChange={handleChange}
            options={usuarios}
            placeholder="Sin usuario asociado"
            disabled={loadingRefs && !usuarios.length}
            getOptionLabel={(u) => u.username}
            getOptionValue={(u) => u.id_usuario}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
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
