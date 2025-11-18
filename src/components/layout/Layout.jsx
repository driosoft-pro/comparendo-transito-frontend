import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import clsx from "clsx";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cerrar el sidebar móvil cuando se cambia a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevenir scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ========== SIDEBAR DESKTOP ========== */}
      {/* Posición fija a la izquierda, oculto en móvil */}
      <div
        className={clsx(
          "fixed left-0 top-0 z-20 hidden h-screen transition-all duration-300 ease-in-out md:block",
          isSidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          isMobile={false}
        />
      </div>

      {/* ========== SIDEBAR MÓVIL (DRAWER) ========== */}
      {isMobileSidebarOpen && (
        <>
          {/* Overlay oscuro de fondo */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />

          {/* Drawer deslizante desde la izquierda */}
          <div
            className={clsx(
              "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out md:hidden",
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar
              isCollapsed={false}
              isMobile={true}
              onCloseMobile={closeMobileSidebar}
            />
          </div>
        </>
      )}

      {/* ========== CONTENIDO PRINCIPAL ========== */}
      {/* Se desplaza según el ancho del sidebar en desktop */}
      <div
        className={clsx(
          "flex min-h-screen w-full flex-col transition-all duration-300 ease-in-out",
          // Sin margen en móvil
          "ml-0",
          // Con margen en desktop según estado del sidebar
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
        )}
      >
        {/* Header fijo en la parte superior */}
        <Header onOpenMobileSidebar={openMobileSidebar} />

        {/* Área de contenido con scroll */}
        <main className="flex-1 overflow-y-auto bg-slate-100/50 p-4 dark:bg-slate-900/50 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {/* Aquí se renderizan las páginas hijas */}
            <Outlet />
          </div>
        </main>

        {/* Footer opcional */}
        <footer className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Sistema de Comparendos de Tránsito.
              Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
