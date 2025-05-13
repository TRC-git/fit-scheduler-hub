
import React from 'react';

interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => (
  <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
    <p className="text-fitness-text mb-4">No integrations have been set up yet. You can add integrations to connect with external services.</p>
    <p className="text-fitness-text text-sm mb-4">Click the refresh button if you believe integrations should be available.</p>
    <button 
      onClick={onRefresh} 
      className="mt-2 bg-fitness-accent text-black px-3 py-1 rounded text-sm hover:bg-fitness-accent-dark transition"
    >
      Refresh
    </button>
  </div>
);
