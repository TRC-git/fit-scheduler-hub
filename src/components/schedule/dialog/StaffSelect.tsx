import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const StaffSelect = ({ value, onChange }: StaffSelectProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-fitness-text">Staff Name</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
          <SelectValue placeholder="Select staff" />
        </SelectTrigger>
        <SelectContent className="bg-[#333333] border-[#d1d1d1]">
          <SelectItem value="Heath Graham" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Heath Graham</SelectItem>
          <SelectItem value="John Doe" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">John Doe</SelectItem>
          <SelectItem value="Jane Smith" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Jane Smith</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};