
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { ThemeToggle } from '../components/common/ThemeToggle.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      const apiMessage =
        error?.response?.data?.message || 'No se pudo iniciar sesión';
      setErrorMsg(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="relative w-full max-w-md rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:bg-slate-900/95">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-lg font-bold text-white">
            CT
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Comparendo Tránsito
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Panel de administración
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {errorMsg && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/50 dark:text-red-200">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Usa tus credenciales del backend <br />
          <code>comparendo-transito-backend</code>
        </p>
      </div>
    </div>
  );
};

export default Login;
