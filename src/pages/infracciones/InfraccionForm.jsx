import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import {
  createInfraccion,
  getInfraccionById,
  updateInfraccion,
} from '../../services/infraccionesService.js';

const InfraccionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    codigo: '',
    descripcion: '',
    valor: '',
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchInfraccion = async () => {
      setErrorMsg('');
      try {
        const data = await getInfraccionById(id);
        const inf = data.infraccion || data;
        setForm({
          codigo: inf.codigo || '',
          descripcion: inf.descripcion || '',
          valor: inf.valor ?? '',
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message ||
          'No se pudo cargar la infracción';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchInfraccion();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateInfraccion(id, form);
      } else {
        await createInfraccion(form);
      }
      navigate('/infracciones');
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        'No se pudo guardar la infracción';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Cargando infracción...</p>;
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? 'Editar infracción' : 'Nueva infracción'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Define el código, descripción y valor de la infracción.
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
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
          <Input
            label="Valor"
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/infracciones')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfraccionForm;
