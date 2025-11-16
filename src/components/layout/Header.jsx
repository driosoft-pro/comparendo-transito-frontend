
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ThemeToggle } from '../common/ThemeToggle.jsx';
import { Button } from '../common/Button.jsx';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Panel de administración
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Gestiona usuarios y módulos del sistema de comparendos.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="text-right text-xs">
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {user?.username || 'Usuario'}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {user?.rol || 'Rol'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
