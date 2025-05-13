
import React from 'react';

interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => (
  <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
    <p className="text-fitness-text">No integrations found. Try refreshing the page.</p>
    <button 
      onClick={onRefresh} 
      className="mt-2 bg-fitness-accent text-black px-3 py-1 rounded text-sm"
    >
      Refresh
    </button>
  </div>
);
