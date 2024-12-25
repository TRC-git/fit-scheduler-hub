import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface PositionFormProps {
  position?: any;
  onSubmit: (positionData: any) => void;
}

export const PositionForm = ({ position, onSubmit }: PositionFormProps) => {
  const [formData, setFormData] = useState({
    positionname: position?.positionname || '',
    paytype: position?.paytype || '',
    defaultpayrate: position?.defaultpayrate || '',
    required_certifications: position?.required_certifications?.join(', ') || '',
    min_experience_months: position?.min_experience_months || ''
  });

  const handleSubmit = () => {
    const certifications = formData.required_certifications
      ? formData.required_certifications.split(',').map(cert => cert.trim())
      : [];

    onSubmit({
      ...formData,
      required_certifications: certifications,
      defaultpayrate: Number(formData.defaultpayrate),
      min_experience_months: Number(formData.min_experience_months)
    });
  };

  return (
    <div className="grid gap-4">
      <div>
        <Label className="text-fitness-text">Position Name</Label>
        <Input 
          placeholder="Enter position name" 
          className="bg-fitness-inner text-fitness-text"
          value={formData.positionname}
          onChange={(e) => setFormData(prev => ({ ...prev, positionname: e.target.value }))}
        />
      </div>
      
      <div>
        <Label className="text-fitness-text">Pay Type</Label>
        <Select 
          value={formData.paytype}
          onValueChange={(value) => setFormData(prev => ({ ...prev, paytype: value }))}
        >
          <SelectTrigger className="bg-fitness-inner text-fitness-text">
            <SelectValue placeholder="Select pay type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="session">By Session</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-fitness-text">Default Rate</Label>
        <Input 
          type="number" 
          placeholder="0.00" 
          className="bg-fitness-inner text-fitness-text"
          value={formData.defaultpayrate}
          onChange={(e) => setFormData(prev => ({ ...prev, defaultpayrate: e.target.value }))}
        />
      </div>

      <div>
        <Label className="text-fitness-text">Required Certifications</Label>
        <Input 
          placeholder="Enter certifications (comma-separated)" 
          className="bg-fitness-inner text-fitness-text"
          value={formData.required_certifications}
          onChange={(e) => setFormData(prev => ({ ...prev, required_certifications: e.target.value }))}
        />
      </div>

      <div>
        <Label className="text-fitness-text">Minimum Experience (months)</Label>
        <Input 
          type="number" 
          placeholder="0" 
          className="bg-fitness-inner text-fitness-text"
          value={formData.min_experience_months}
          onChange={(e) => setFormData(prev => ({ ...prev, min_experience_months: e.target.value }))}
        />
      </div>

      <Button 
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
        onClick={handleSubmit}
      >
        {position ? 'Update Position' : 'Add Position'}
      </Button>
    </div>
  );
};