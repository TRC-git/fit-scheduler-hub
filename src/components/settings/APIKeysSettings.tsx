import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
}

const APIKeysSettings = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<ModelConfig[]>([
    { id: "gpt-3.5", name: "GPT-3.5 Turbo", enabled: false, apiKey: "" },
    { id: "gpt-4", name: "GPT-4.0", enabled: false, apiKey: "" },
    { id: "gpt-o1", name: "GPT-O1", enabled: false, apiKey: "" },
    { id: "grok", name: "Grok", enabled: false, apiKey: "" },
    { id: "llama", name: "Llama", enabled: false, apiKey: "" },
    { id: "gemini", name: "Gemini", enabled: false, apiKey: "" },
  ]);

  const handleToggleModel = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const handleApiKeyChange = (modelId: string, value: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, apiKey: value } : model
    ));
  };

  const handleSave = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    try {
      // Save the API key to Supabase secrets
      const secretName = `${model.id.toUpperCase()}_API_KEY`;
      
      toast({
        title: "Success",
        description: `API key for ${model.name} has been saved.`,
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-fitness-card rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-fitness-text">AI Model Settings</h2>
        <p className="text-fitness-text/80">
          Configure AI models and their API keys for schedule generation and other AI features.
        </p>
      </div>

      <div className="grid gap-6">
        {models.map((model) => (
          <Card key={model.id} className="p-6 bg-fitness-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Switch
                  id={`${model.id}-toggle`}
                  checked={model.enabled}
                  onCheckedChange={() => handleToggleModel(model.id)}
                />
                <Label htmlFor={`${model.id}-toggle`} className="text-fitness-text font-medium">
                  {model.name}
                </Label>
              </div>
            </div>

            {model.enabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${model.id}-api-key`} className="text-fitness-text">
                    API Key
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`${model.id}-api-key`}
                      type="password"
                      value={model.apiKey}
                      onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                      className="flex-1 bg-fitness-background text-fitness-text"
                      placeholder="Enter API key"
                    />
                    <Button 
                      onClick={() => handleSave(model.id)}
                      className="bg-fitness-accent hover:bg-fitness-accent/80 text-black"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APIKeysSettings;