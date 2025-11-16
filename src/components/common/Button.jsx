
import React from 'react';
import clsx from 'clsx';

const baseClasses =
  'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  outline:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost:
    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
};

const sizes = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const Comp = props.as || 'button';
  const { as, ...rest } = props;

  return (
    <Comp
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Comp>
  );
};
