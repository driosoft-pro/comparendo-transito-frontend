import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/common/Input.jsx";
import { Button } from "../../components/common/Button.jsx";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../services/usersService.js";

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    rol: "ciudadano",
    estado: 1,
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setErrorMsg("");
      try {
        const data = await getUserById(id);
        const u = data.usuario || data.user || data;
        setForm({
          username: u.username || "",
          password: "",
          rol: u.rol || "ciudadano",
          estado: u.estado ?? 1,
        });
      } catch (error) {
        console.error(error);
        const msg =
          error?.response?.data?.message || "No se pudo cargar el usuario";
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      fetchUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "estado" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (isEdit) {
        const payload = {
          username: form.username,
          rol: form.rol,
          estado: form.estado,
        };
        if (form.password) {
          payload.contrasena = form.password;
        }
        await updateUser(id, payload);
      } else {
        await createUser({
          username: form.username,
          password: form.password,
          rol: form.rol,
        });
      }
      navigate("/usuarios");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "No se pudo guardar el usuario";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Cargando usuario...</p>;
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEdit ? "Editar usuario" : "Nuevo usuario"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Modifica los datos del usuario seleccionado."
            : "Crea un nuevo usuario con rol y credenciales."}
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Input
          label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!isEdit}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Rol
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="administrador">Administrador</option>
              <option value="policia_transito">Policía</option>
              <option value="ciudadano">Ciudadano</option>
              <option value="operador">Operador</option>
              <option value="auditor">Auditor</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

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
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
