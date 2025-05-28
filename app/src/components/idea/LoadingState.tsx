import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing your request...',
  size = 'lg',
  color = 'primary',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 animate-fade-in">
      <div className="bg-primary-light/10 dark:bg-primary-dark/20 rounded-full p-6">
        <LoadingSpinner size={size} color={color} />
      </div>
      <div className="max-w-md text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          This may take a moment as our AI processes your request
        </p>
      </div>
    </div>
  );
};