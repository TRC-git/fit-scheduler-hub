import { Input } from "@/components/ui/input";
import { Adjustments } from "../types/payroll";

interface PayrollAdjustmentsFormProps {
  adjustments: Adjustments;
  onChange: (adjustments: Adjustments) => void;
}

export const PayrollAdjustmentsForm = ({ adjustments, onChange }: PayrollAdjustmentsFormProps) => {
  return (
    <>
      <tr className="border-fitness-grid hover:bg-fitness-inner">
        <td className="text-fitness-text font-medium">
          Bonus
        </td>
        <td className="text-right">
          <Input
            type="number"
            value={adjustments.bonus}
            onChange={(e) => onChange({
              ...adjustments,
              bonus: parseFloat(e.target.value) || 0
            })}
            className="w-32 ml-auto bg-fitness-inner text-fitness-text text-right"
          />
        </td>
      </tr>
      <tr className="border-fitness-grid hover:bg-fitness-inner">
        <td className="text-fitness-text font-medium">
          Deductions
        </td>
        <td className="text-right">
          <Input
            type="number"
            value={adjustments.deductions}
            onChange={(e) => onChange({
              ...adjustments,
              deductions: parseFloat(e.target.value) || 0
            })}
            className="w-32 ml-auto bg-fitness-inner text-fitness-text text-right"
          />
        </td>
      </tr>
      <tr className="border-fitness-grid hover:bg-fitness-inner">
        <td className="text-fitness-text font-medium">
          Comments
        </td>
        <td className="text-right">
          <Input
            value={adjustments.comments}
            onChange={(e) => onChange({
              ...adjustments,
              comments: e.target.value
            })}
            className="w-full bg-fitness-inner text-fitness-text"
          />
        </td>
      </tr>
    </>
  );
};