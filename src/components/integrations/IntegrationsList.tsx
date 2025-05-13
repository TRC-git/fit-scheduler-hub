
import React from 'react';
import { Integration } from './IntegrationCard';
import { LeadConnectorIntegration } from './LeadConnectorIntegration';

interface IntegrationsListProps {
  integrations: Integration[];
}

export const IntegrationsList: React.FC<IntegrationsListProps> = ({ integrations }) => {
  return (
    <>
      {integrations.map(integration => (
        <div key={integration.type}>
          {integration.type === 'leadconnector' ? (
            <LeadConnectorIntegration integration={integration} />
          ) : (
            <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
              <div className="font-bold text-fitness-text mb-2">{integration.name}</div>
              <div className="mb-2 text-fitness-text">
                Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : ''}`}>
                  {integration.status}
                </span>
              </div>
              <div className="text-fitness-text text-sm italic">
                This integration type does not have specific UI controls.
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
