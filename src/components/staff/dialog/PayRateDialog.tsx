import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PayRateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: any;
  onSubmit: (payRate: number) => void;
}

export const PayRateDialog = ({ isOpen, onClose, position, onSubmit }: PayRateDialogProps) => {
  const [payRate, setPayRate] = useState(position?.payrate?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPayRate = parseFloat(payRate);
    if (!isNaN(numericPayRate)) {
      onSubmit(numericPayRate);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-fitness-card">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">
            Edit Pay Rate for {position?.positions?.positionname}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payRate" className="text-fitness-text">
              Pay Rate ($/hr)
            </Label>
            <Input
              id="payRate"
              type="number"
              step="0.01"
              min="0"
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
              className="bg-fitness-inner text-fitness-text"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-fitness-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};