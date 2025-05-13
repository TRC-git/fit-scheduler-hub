
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OAuthConnector } from './OAuthConnector';
import { ManualConnector } from './ManualConnector';

interface ConnectionTabsProps {
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  actionLoading: boolean;
}

export const ConnectionTabs: React.FC<ConnectionTabsProps> = ({
  setActionLoading,
  setError,
  actionLoading,
}) => {
  return (
    <Tabs defaultValue="oauth" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="oauth" className="flex-1">Connect via OAuth</TabsTrigger>
        <TabsTrigger value="manual" className="flex-1">Connect Manually</TabsTrigger>
      </TabsList>
      
      <TabsContent value="oauth" className="pt-2">
        <OAuthConnector 
          setActionLoading={setActionLoading} 
          setError={setError} 
          actionLoading={actionLoading} 
        />
      </TabsContent>
      
      <TabsContent value="manual" className="space-y-4 pt-2">
        <ManualConnector 
          setActionLoading={setActionLoading} 
          setError={setError} 
          actionLoading={actionLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};
