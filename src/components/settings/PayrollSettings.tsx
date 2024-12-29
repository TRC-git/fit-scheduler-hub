import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { PayPeriodSection } from "./payroll/PayPeriodSection";
import { TaxWithholdingSection } from "./payroll/TaxWithholdingSection";
import { DeductionsSection } from "./payroll/DeductionsSection";
import { OvertimeSection } from "./payroll/OvertimeSection";
import { HolidayPTOSection } from "./payroll/HolidayPTOSection";
import { CommissionSection } from "./payroll/CommissionSection";
import { DirectDepositSection } from "./payroll/DirectDepositSection";
import { usePayrollSettings } from "@/hooks/usePayrollSettings";

const PayrollSettings = () => {
  const { 
    employeeId,
    settings,
    isLoadingEmployee,
    isLoadingSettings,
    updateSettingsMutation
  } = usePayrollSettings();

  if (isLoadingEmployee || isLoadingSettings) {
    return (
      <Card className="bg-fitness-card">
        <CardContent className="p-6">
          Loading payroll settings...
        </CardContent>
      </Card>
    );
  }

  if (!employeeId) {
    return (
      <Card className="bg-fitness-card">
        <CardContent className="p-6">
          No employee record found. Please contact your administrator.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-fitness-text" />
          <CardTitle className="text-fitness-text text-3xl">Payroll Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-12">
        <div className="grid gap-8">
          <PayPeriodSection />
          <TaxWithholdingSection 
            settings={settings?.tax} 
            onUpdate={(tax) => updateSettingsMutation.mutate({ tax })}
          />
          <DeductionsSection 
            settings={settings?.deductions}
            onUpdate={(deductions) => updateSettingsMutation.mutate({ deductions })}
          />
          <OvertimeSection 
            settings={settings?.overtime}
            onUpdate={(overtime) => updateSettingsMutation.mutate({ overtime })}
          />
          <HolidayPTOSection 
            settings={settings?.pto}
            onUpdate={(pto) => updateSettingsMutation.mutate({ pto })}
          />
          <CommissionSection 
            settings={settings?.commission}
            onUpdate={(commission) => updateSettingsMutation.mutate({ commission })}
          />
          <DirectDepositSection />
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSettings;