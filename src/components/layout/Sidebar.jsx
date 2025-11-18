import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Button } from "../common/Button.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/usuarios", label: "Usuarios", icon: "👥" },
  { to: "/perfiles", label: "Perfiles", icon: "👤" },
  { to: "/vehiculos", label: "Vehículos", icon: "🚗" },
  { to: "/categorias-licencia", label: "Categorías de Licencia", icon: "📜" },
  { to: "/licencias", label: "Licencias", icon: "🎫" },
  { to: "/municipios", label: "Municipios", icon: "🏙️" },
  { to: "/comparendos", label: "Comparendos", icon: "👮" },
  { to: "/infracciones", label: "Infracciones", icon: "⚠️" },
  { to: "/quejas", label: "Quejas", icon: "💬" },
];

const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}) => {
  const showLabels = !isCollapsed || isMobile;

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 md:shadow-sm">
      {/* Header: Logo + Botón colapsar/cerrar */}
      <div className="flex min-h-[72px] items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          {/* Logo */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-600 text-base font-bold text-white shadow-md">
            CT
          </div>

          {/* Título - Visible cuando no está colapsado o en móvil */}
          {showLabels && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
                Comparendo Tránsito
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Panel admin
              </p>
            </div>
          )}
        </div>

        {/* Botón colapsar (desktop) o cerrar (móvil) */}
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseMobile}
            className="flex-shrink-0"
            title="Cerrar menú"
          >
            <span className="text-xl">✕</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden flex-shrink-0 md:inline-flex"
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <span className="text-base">{isCollapsed ? "→" : "←"}</span>
          </Button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={!showLabels ? item.label : undefined}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                // Estados normales
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                // Estado activo
                isActive &&
                  "bg-primary-600 text-white shadow-sm hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700",
                // Centrado cuando está colapsado (desktop)
                isCollapsed && !isMobile && "justify-center",
              )
            }
            onClick={() => {
              if (isMobile && onCloseMobile) {
                onCloseMobile();
              }
            }}
          >
            {/* Icono */}
            <span className="flex-shrink-0 text-lg leading-none">
              {item.icon}
            </span>

            {/* Label - visible cuando no está colapsado o en móvil */}
            {showLabels && (
              <span className="truncate leading-none">{item.label}</span>
            )}

            {/* Indicador visual cuando está activo y colapsado */}
            {isCollapsed && !isMobile && (
              <span className="sr-only">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Versión e info */}
      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700">
        {showLabels ? (
          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-sm">ℹ️</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <p className="text-[11px] leading-tight">
              Sistema de Comparendos de Tránsito
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-base" title="Información">
              ℹ️
            </span>
            <span className="text-[10px] font-medium" title="Versión 1.0.0">
              v1.0
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
