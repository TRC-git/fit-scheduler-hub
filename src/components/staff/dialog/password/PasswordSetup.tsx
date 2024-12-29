import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordSetupProps {
  password: string;
  confirmPassword: string;
  passwordError: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export const PasswordSetup = ({
  password,
  confirmPassword,
  passwordError,
  onPasswordChange,
  onConfirmPasswordChange,
}: PasswordSetupProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-fitness-text">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-fitness-text">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>
      {passwordError && (
        <p className="text-sm text-red-500">{passwordError}</p>
      )}
    </div>
  );
};