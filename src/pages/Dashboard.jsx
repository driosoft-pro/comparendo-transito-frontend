
import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
        Bienvenido 👋
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Hola <span className="font-semibold">{user?.username}</span>, este es el
        panel principal del sistema de comparendos. Desde aquí podrás gestionar
        usuarios y, en el futuro, módulos como comparendos, quejas y más.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Rol
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {user?.rol || 'No definido'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Los permisos de acceso dependen del rol configurado en el backend.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Módulo
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Usuarios
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Gestiona cuentas, estados y roles. Accede desde el menú lateral.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Próximamente
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Comparendos &amp; Quejas
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Puedes extender este panel para administrar comparendos,
            infracciones y quejas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
