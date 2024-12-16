import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const PermissionSettings = () => {
  const { toast } = useToast()

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          employeepositions (
            *,
            positions (*)
          ),
          calendar_access (*)
        `)
      
      if (error) throw error
      return data
    }
  })

  const updateAccessMutation = useMutation({
    mutationFn: async ({ employeeId, access }: any) => {
      const { data, error } = await supabase
        .from('calendar_access')
        .upsert([{
          employeeid: employeeId,
          ...access
        }])
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      })
    },
  })

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Select Employee</Label>
            <Select>
              <SelectTrigger className="bg-fitness-inner text-fitness-text">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee: any) => (
                  <SelectItem 
                    key={employee.employeeid} 
                    value={employee.employeeid.toString()}
                  >
                    {employee.firstname} {employee.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-fitness-text mb-2">Calendar Access</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="view-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="view-schedule" className="text-fitness-text">
                  View Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="edit-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="edit-schedule" className="text-fitness-text">
                  Edit Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-schedule" className="text-fitness-text">
                  Manage Schedule Templates
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-fitness-text mb-2">Position Access</Label>
            <div className="space-y-2">
              {employees?.[0]?.employeepositions?.map((position: any) => (
                <div key={position.employeepositionid} className="p-4 bg-fitness-inner rounded-md">
                  <h4 className="text-fitness-text font-medium">
                    {position.positions.positionname}
                  </h4>
                  <p className="text-fitness-text/70 text-sm mt-1">
                    Access Level: {position.access_level}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
            onClick={() => updateAccessMutation.mutate({
              employeeId: 1,
              access: {
                calendar_type: "main",
                can_view: true,
                can_edit: true,
                can_manage: false
              }
            })}
          >
            Save Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PermissionSettings
