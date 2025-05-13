
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-fitness-accent mb-4" />
    <p className="text-fitness-text">Loading integrations...</p>
  </div>
);
