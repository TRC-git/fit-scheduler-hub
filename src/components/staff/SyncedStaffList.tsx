import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, RefreshCw, UserPlus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { syncUsersAndCalendars } from "@/integrations/apis/integrationsApi";
import { useState } from "react";

interface SyncedUser {
  id: number;
  ghl_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  is_active: boolean;
  synced_at: string;
}

const SyncedStaffList = () => {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  // Fetch synced users
  const { data: syncedUsers, isLoading, refetch } = useQuery({
    queryKey: ['syncedStaffUsers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('ghl_synced_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('synced_at', { ascending: false });
      
      if (error) throw error;
      return data as SyncedUser[];
    }
  });

  // Check if LeadConnector is connected
  const { data: integration } = useQuery({
    queryKey: ['leadConnectorIntegrationStaff'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('integration_type', 'leadconnector')
        .single();
      
      if (error) return null;
      return data;
    }
  });

  const handleSync = async () => {
    if (!integration || integration.status !== 'connected') {
      toast({
        title: "LeadConnector Not Connected",
        description: "Please connect your LeadConnector integration first.",
        variant: "destructive",
      });
      return;
    }

    setSyncing(true);
    try {
      await syncUsersAndCalendars();
      await refetch();
      
      toast({
        title: "Sync Successful",
        description: "Staff from GoHighLevel have been synced successfully.",
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync staff from GoHighLevel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = integration?.status === 'connected';

  return (
    <Card className="bg-fitness-card mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-fitness-text flex items-center gap-2">
            <Users className="w-5 h-5 text-fitness-accent" />
            GoHighLevel Staff ({syncedUsers?.length || 0})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleSync}
              disabled={syncing || !isConnected}
              variant="outline"
              size="sm"
              className="border-fitness-accent text-fitness-accent hover:bg-fitness-accent hover:text-black"
            >
              {syncing ? (
                <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Syncing...</>
              ) : (
                <><RefreshCw className="h-3 w-3 mr-1" /> Sync</>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <p className="text-sm">
                Connect LeadConnector in Settings → Integrations to sync staff from GoHighLevel.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-fitness-accent" />
            <span className="ml-2 text-fitness-text">Loading synced staff...</span>
          </div>
        ) : syncedUsers && syncedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {syncedUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-fitness-background rounded-lg border border-fitness-border hover:border-fitness-accent transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-fitness-accent/20 flex items-center justify-center">
                    <span className="text-fitness-accent font-medium text-lg">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                      {user.last_name?.[0] || ''}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-fitness-text">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </div>
                    {user.role && (
                      <div className="text-xs text-fitness-accent bg-fitness-accent/10 px-2 py-1 rounded mt-1 inline-block">
                        {user.role}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium">Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      Synced: {new Date(user.synced_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                      From GHL
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">No GoHighLevel Staff Synced</h3>
            <p className="text-sm mb-4">
              {isConnected 
                ? "Click 'Sync' to import staff from your GoHighLevel location."
                : "Connect LeadConnector integration to sync staff from GoHighLevel."
              }
            </p>
            {isConnected && (
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-fitness-accent text-black hover:bg-fitness-accent-dark"
              >
                {syncing ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Syncing...</>
                ) : (
                  <><UserPlus className="h-4 w-4 mr-2" /> Sync Staff Now</>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncedStaffList; 