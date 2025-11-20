import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
} from "../../services/vehiculosService.js";
import { getMunicipios } from "../../services/municipiosService.js";

// Listas para selects
const VEHICLE_TYPES = [
  "Automóvil",
  "Moto",
  "Bus",
  "Microbús",
  "Camioneta",
  "Camión",
  "Tractomula",
];

const SERVICE_CLASSES = [
  "Particular",
  "Público",
  "Oficial",
  "Diplomático",
  "Consular",
];

// ---- Select con filtro integrado (igual que en PerfilForm) ----
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
    onChange({ target: { name, value: String(val) } });
    setOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

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

      {/* hidden para required */}
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

const VehiculoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [municipios, setMunicipios] = useState([]);
  const [form, setForm] = useState({
    placa: "",
    tipo_vehiculo: "",
    marca: "",
    linea_modelo: "",
    cilindraje: "",
    modelo_ano: "",
    color: "",
    clase_servicio: "",
    id_municipio: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMunicipios = async () => {
      try {
        const data = await getMunicipios();
        setMunicipios(data.municipios || data || []);
      } catch (err) {
        console.error("Error cargando municipios:", err);
      }
    };
    loadMunicipios();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const loadVehiculo = async () => {
      try {
        setLoading(true);
        setError("");
        const v = await getVehiculoById(id);

        if (!v || typeof v !== "object") {
          setError("No se encontró el vehículo");
          return;
        }

        setForm({
          placa: v.placa || "",
          tipo_vehiculo: v.tipo_vehiculo || "",
          marca: v.marca || "",
          linea_modelo: v.linea_modelo || "",
          cilindraje: v.cilindraje || "",
          modelo_ano: v.modelo_ano ? String(v.modelo_ano) : "",
          color: v.color || "",
          clase_servicio: v.clase_servicio || "",
          id_municipio: v.id_municipio ?? "",
        });
      } catch (err) {
        console.error("Error cargando vehículo:", err);
        setError("No se pudo cargar el vehículo");
      } finally {
        setLoading(false);
      }
    };

    loadVehiculo();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      ...form,
      id_municipio: form.id_municipio ? Number(form.id_municipio) : null,
      modelo_ano: form.modelo_ano ? Number(form.modelo_ano) : null, // solo año
    };

    try {
      if (isEdit) {
        await updateVehiculo(id, payload);
      } else {
        await createVehiculo(payload);
      }
      navigate("/vehiculos");
    } catch (err) {
      console.error("Error guardando vehículo:", err);
      setError("No se pudo guardar el vehículo");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        Cargando vehículo...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Editar vehículo" : "Nuevo vehículo"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Información del automotor 🚗
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/vehiculos")}>
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
          label="Placa"
          name="placa"
          value={form.placa}
          onChange={handleChange}
          placeholder="ABC123"
          required
        />

        {/* Tipo de vehículo: select */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tipo de vehículo
          </label>
          <select
            name="tipo_vehiculo"
            value={form.tipo_vehiculo}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Seleccione tipo...</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Marca"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            required
          />
          <Input
            label="Línea / modelo"
            name="linea_modelo"
            value={form.linea_modelo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Cilindraje"
            name="cilindraje"
            value={form.cilindraje}
            onChange={handleChange}
            placeholder="125cc, 2000cc..."
            required
          />

          {/* Modelo solo año */}
          <Input
            label="Modelo (año)"
            type="number"
            name="modelo_ano"
            value={form.modelo_ano}
            onChange={handleChange}
            placeholder="2020"
            min="1900"
            max="2100"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Color"
            name="color"
            value={form.color}
            onChange={handleChange}
            required
          />

          {/* Clase de servicio: select */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Clase de servicio
            </label>
            <select
              name="clase_servicio"
              value={form.clase_servicio}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Seleccione clase...</option>
              {SERVICE_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Municipio con filtro */}
        <FilterableSelect
          label="Municipio"
          name="id_municipio"
          value={form.id_municipio}
          onChange={handleChange}
          options={municipios}
          placeholder="Seleccione un municipio..."
          required
          disabled={!municipios.length}
          getOptionLabel={(m) => m.nombre_municipio}
          getOptionValue={(m) => m.id_municipio}
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/vehiculos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Guardando..."
              : isEdit
                ? "Actualizar vehículo"
                : "Registrar vehículo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehiculoForm;
