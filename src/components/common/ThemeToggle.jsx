
import React from 'react';
import { useTheme } from '../../hooks/useTheme.jsx';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? 'Modo claro ☀️' : 'Modo oscuro 🌙'}
    </button>
  );
};
