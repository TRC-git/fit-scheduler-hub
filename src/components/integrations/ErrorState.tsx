
import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
    <div className="text-red-400 mb-4 p-3 bg-red-100/10 border border-red-400 rounded">
      <p>{error}</p>
      <button 
        onClick={onRetry} 
        className="mt-2 bg-red-400 text-white px-3 py-1 rounded text-sm"
      >
        Retry
      </button>
    </div>
    <p className="text-fitness-text">
      Integrations could not be loaded. Please check your connection and try again.
    </p>
  </div>
);
