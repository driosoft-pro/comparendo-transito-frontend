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

  useEffect(() => {
    const loadMunicipios = async () => {
      const data = await getMunicipios();
      setMunicipios(data.municipios || data || []);
    };
    loadMunicipios();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchVehiculo = async () => {
        try {
          setLoading(true);
          const data = await getVehiculoById(id);
          const v = data.vehiculo || data;

          setForm({
            placa: v.placa,
            tipo_vehiculo: v.tipo_vehiculo,
            marca: v.marca,
            linea_modelo: v.linea_modelo,
            cilindraje: v.cilindraje,
            modelo_ano: v.modelo_ano,
            color: v.color,
            clase_servicio: v.clase_servicio,
            id_municipio: v.id_municipio,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchVehiculo();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      id_municipio: Number(form.id_municipio),
    };

    try {
      if (isEdit) {
        await updateVehiculo(id, payload);
      } else {
        await createVehiculo(payload);
      }
      navigate("/vehiculos");
    } catch (error) {
      alert("Error guardando vehículo");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-4">Cargando vehículo...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold">
            {isEdit ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h2>
          <p className="text-xs text-slate-500">
            Información del vehículo automotor
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/vehiculos")}>
          Volver
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700 space-y-4"
      >
        <Input
          label="Placa *"
          name="placa"
          value={form.placa}
          onChange={handleChange}
          placeholder="ABC123"
          required
        />

        <Input
          label="Tipo de Vehículo *"
          name="tipo_vehiculo"
          value={form.tipo_vehiculo}
          onChange={handleChange}
          placeholder="Automóvil, Moto, Camioneta..."
          required
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Marca *"
            name="marca"
            value={form.marca}
            onChange={handleChange}
            required
          />
          <Input
            label="Línea / Modelo *"
            name="linea_modelo"
            value={form.linea_modelo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Cilindraje *"
            name="cilindraje"
            value={form.cilindraje}
            onChange={handleChange}
            placeholder="125cc, 2000cc"
            required
          />

          <Input
            label="Año Modelo *"
            type="number"
            name="modelo_ano"
            value={form.modelo_ano}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Color *"
            name="color"
            value={form.color}
            onChange={handleChange}
            required
          />

          <Input
            label="Clase de servicio *"
            name="clase_servicio"
            value={form.clase_servicio}
            onChange={handleChange}
            placeholder="Particular / Público"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Municipio *</label>
          <select
            name="id_municipio"
            value={form.id_municipio}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-600"
          >
            <option value="">Seleccione un municipio...</option>
            {municipios.map((m) => (
              <option key={m.id_municipio} value={m.id_municipio}>
                {m.nombre_municipio} ({m.departamento})
              </option>
            ))}
          </select>
        </div>

        {/* acciones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-300 dark:border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/vehiculos")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehiculoForm;
