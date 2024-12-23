import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const OvertimeSection = ({ overtimeRules }: { overtimeRules: any[] }) => {
  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Overtime Rules</h2>
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <Label className="text-fitness-text">Rule Description</Label>
          <Textarea 
            placeholder="Enter overtime rule description..."
            className="bg-fitness-inner text-fitness-text min-h-[100px]"
          />
        </div>
        {overtimeRules?.map((rule: any) => (
          <div key={rule.ruleid} className="p-4 bg-fitness-inner rounded-md">
            <h4 className="text-fitness-text font-medium">{rule.description}</h4>
            <p className="text-fitness-text/70 text-sm mt-1">
              Threshold: {rule.thresholdhours} hours | Rate: {rule.overtimeratemultiplier}x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};