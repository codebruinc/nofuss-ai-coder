import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true,
  className = '',
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="var(--primary)" />
          <path
            d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20V28H20C15.5817 28 12 24.4183 12 20Z"
            fill="white"
          />
          <path
            d="M20 18C18.8954 18 18 18.8954 18 20C18 21.1046 18.8954 22 20 22H24V20C24 18.8954 23.1046 18 22 18H20Z"
            fill="var(--primary)"
          />
        </svg>
      </div>
      {withText && (
        <span className={`ml-2 font-bold ${textSizes[size]} text-gray-900 dark:text-white`}>
          NoFuss<span className="text-primary">AI</span>
        </span>
      )}
    </Link>
  );
};