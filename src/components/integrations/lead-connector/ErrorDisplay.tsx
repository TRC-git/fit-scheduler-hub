
import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`mt-4 text-red-400 p-3 bg-red-100/10 border border-red-400 rounded-md ${className}`}>
      {error}
    </div>
  );
};
