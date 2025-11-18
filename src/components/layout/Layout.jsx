import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import clsx from "clsx";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Sidebar desktop */}
      <div
        className={clsx(
          "hidden md:flex md:flex-col fixed left-0 top-0 h-full z-20 transition-all duration-200",
          isSidebarCollapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Sidebar móvil (drawer) */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
            onClick={closeMobileSidebar}
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 md:hidden">
            <Sidebar
              isCollapsed={false}
              isMobile
              onCloseMobile={closeMobileSidebar}
            />
          </div>
        </>
      )}

      {/* Contenido principal */}
      <div
        className={clsx(
          "flex flex-1 flex-col transition-all duration-200 w-full",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
        )}
      >
        <Header onOpenMobileSidebar={openMobileSidebar} />
        <main className="flex-1 bg-slate-50/70 p-4 dark:bg-slate-950/60">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
