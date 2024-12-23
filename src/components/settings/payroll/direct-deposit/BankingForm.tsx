import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DirectDepositInfo } from "@/types/direct-deposit";

interface BankingFormProps {
  defaultValues?: Partial<DirectDepositInfo>;
}

export const BankingForm = ({ defaultValues }: BankingFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label className="text-fitness-text">Bank Name</Label>
        <Input
          name="bankName"
          placeholder="Enter bank name"
          defaultValue={defaultValues?.bank_name}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-fitness-text">Account Type</Label>
        <select
          name="accountType"
          defaultValue={defaultValues?.account_type}
          className="w-full h-10 rounded-md border border-input bg-fitness-inner px-3 py-2 text-fitness-text"
          required
        >
          <option value="">Select account type</option>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="text-fitness-text">Routing Number</Label>
        <Input
          name="routingNumber"
          placeholder="Enter routing number"
          defaultValue={defaultValues?.routing_number}
          className="bg-fitness-inner text-fitness-text"
          required
          pattern="^\d{9}$"
          title="Routing number must be 9 digits"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-fitness-text">Account Number</Label>
        <Input
          name="accountNumber"
          placeholder="Enter account number"
          defaultValue={defaultValues?.account_number}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>
    </>
  );
};