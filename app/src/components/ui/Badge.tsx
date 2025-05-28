import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-primary-light/20 text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light',
    secondary: 'bg-secondary-light/20 text-secondary-dark dark:bg-secondary-dark/30 dark:text-secondary-light',
    accent: 'bg-accent-light/20 text-accent-dark dark:bg-accent-dark/30 dark:text-accent-light',
    success: 'bg-success/20 text-success dark:bg-success/30 dark:text-success',
    warning: 'bg-warning/20 text-warning dark:bg-warning/30 dark:text-warning',
    error: 'bg-error/20 text-error dark:bg-error/30 dark:text-error',
    info: 'bg-info/20 text-info dark:bg-info/30 dark:text-info',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </span>
  );
};