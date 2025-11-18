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
          modelo_ano: v.modelo_ano || "",
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
      modelo_ano: form.modelo_ano ? Number(form.modelo_ano) : null,
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

        <Input
          label="Tipo de vehículo"
          name="tipo_vehiculo"
          value={form.tipo_vehiculo}
          onChange={handleChange}
          placeholder="Automóvil, Moto, Camioneta..."
          required
        />

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
          <Input
            label="Modelo año"
            type="number"
            name="modelo_ano"
            value={form.modelo_ano}
            onChange={handleChange}
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
          <Input
            label="Clase de servicio"
            name="clase_servicio"
            value={form.clase_servicio}
            onChange={handleChange}
            placeholder="Particular, Público..."
            required
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
