import React from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ThemeToggle } from "../common/ThemeToggle.jsx";
import { Button } from "../common/Button.jsx";

const Header = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      {/* Izquierda: Botón menú móvil + Título */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Botón hamburguesa - Solo visible en móvil */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700 md:hidden"
          aria-label="Abrir menú de navegación"
        >
          <span className="text-xl leading-none">☰</span>
        </button>

        {/* Título y subtítulo */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="hidden flex-shrink-0 text-xl sm:inline">📊</span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
              Panel de administración
            </h1>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              Sistema de comparendos de tránsito
            </p>
          </div>
        </div>
      </div>

      {/* Derecha: Tema + Usuario + Logout */}
      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        {/* Toggle de tema */}
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>

        {/* Separador vertical - oculto en móvil */}
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* Info del usuario + Botón logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Avatar e info del usuario - oculto en móviles pequeños */}
          <div className="hidden items-center gap-2 sm:flex">
            {/* Avatar simple con iniciales */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Nombre y rol */}
            <div className="hidden text-right lg:block">
              <p className="text-xs font-medium leading-tight text-slate-800 dark:text-slate-100">
                {user?.username || "Usuario"}
              </p>
              <p className="text-[10px] uppercase leading-tight tracking-wide text-slate-500 dark:text-slate-400">
                {user?.rol || "Rol"}
              </p>
            </div>
          </div>

          {/* Botón cerrar sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <span className="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
