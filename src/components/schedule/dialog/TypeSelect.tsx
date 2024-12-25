import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";

interface TypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const TypeSelect = ({ value, onChange }: TypeSelectProps) => {
  const { classTypes, isLoading } = useClassTypes();

  return (
    <div>
      <label className="text-sm font-medium text-fitness-text">Schedule Type</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="bg-[#333333] border-[#d1d1d1]">
          {isLoading ? (
            <SelectItem value="loading" className="text-fitness-text">Loading...</SelectItem>
          ) : (
            classTypes?.map((type) => (
              <SelectItem 
                key={type.schedule_type_id} 
                value={type.name}
                className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]"
              >
                {type.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};