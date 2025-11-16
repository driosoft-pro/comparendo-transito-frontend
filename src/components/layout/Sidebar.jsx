
import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/usuarios', label: 'Usuarios' },
];

const linkBase =
  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkInactive =
  'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50';
const linkActive =
  'bg-primary-600 text-white shadow-sm dark:bg-primary-600';

const Sidebar = () => {
  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
          CT
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Comparendo Tránsito
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Panel admin</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(linkBase, isActive ? linkActive : linkInactive)
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
