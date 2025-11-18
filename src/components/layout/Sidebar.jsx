import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Button } from "../common/Button.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: "󰨇" },
  { to: "/usuarios", label: "Usuarios", icon: "" },
  { to: "/perfiles", label: "Perfiles", icon: "" },
  { to: "/vehiculos", label: "Vehículos", icon: "" },
  { to: "/licencias", label: "Licencias", icon: "" },
  { to: "/comparendos", label: "Comparendos", icon: "󱓥" },
  { to: "/infracciones", label: "Infracciones", icon: "" },
  { to: "/quejas", label: "Quejas", icon: "󰍢" },
  { to: "/municipios", label: "Municipios", icon: "󰅆" },
];

const linkBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const linkInactive =
  "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50";
const linkActive = "bg-primary-600 text-white shadow-sm dark:bg-primary-600";

const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}) => {
  const showLabels = !isCollapsed || isMobile;

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      {/* Logo + botón colapsar */}
      <div
        className={clsx(
          "mb-6 flex items-center",
          isCollapsed && !isMobile ? "justify-center" : "justify-between gap-2",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
            <span>CT</span>
          </div>
          {showLabels && (
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Comparendo Tránsito
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Panel admin
              </p>
            </div>
          )}
        </div>

        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <span className="text-lg">{isCollapsed ? "" : ""}</span>
          </Button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={item.label} // tooltip en hover
            className={({ isActive }) =>
              clsx(
                linkBase,
                isCollapsed && !isMobile && "justify-center px-2",
                !isCollapsed && "justify-start",
                isActive ? linkActive : linkInactive,
              )
            }
            onClick={() => {
              if (isMobile && onCloseMobile) onCloseMobile();
            }}
          >
            <span className="text-lg">{item.icon}</span>
            {showLabels && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer versión */}
      <div className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {showLabels ? (
          <>
            <p>v1.0.0</p>
            <p className="mt-1">Sistema de Comparendos</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg" title="Versión 1.0.0">
              
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
