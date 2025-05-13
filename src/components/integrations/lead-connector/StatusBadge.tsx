
import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: 'connected' | 'not_connected' | 'disconnected';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          borderColor: 'border-green-400/30',
          icon: <CheckCircle className="w-4 h-4 mr-2" />,
          label: 'Connected'
        };
      case 'disconnected':
        return {
          color: 'text-amber-400',
          bgColor: 'bg-amber-400/10',
          borderColor: 'border-amber-400/30',
          icon: <AlertCircle className="w-4 h-4 mr-2" />,
          label: 'Disconnected'
        };
      case 'not_connected':
      default:
        return {
          color: 'text-fitness-text',
          bgColor: 'bg-gray-400/10',
          borderColor: 'border-gray-400/30',
          icon: <Info className="w-4 h-4 mr-2" />,
          label: 'Not Connected'
        };
    }
  };

  const config = getStatusConfig();
  
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border ${config.color} ${className}`}>
      {config.icon}
      {config.label}
    </div>
  );
};
