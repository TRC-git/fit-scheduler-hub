import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const OperatingHours = () => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div>
      <h3 className="text-fitness-text mb-4">Operating Hours</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-fitness-text">Opening Time</Label>
          <Select>
            <SelectTrigger className="bg-fitness-inner text-fitness-text">
              <SelectValue placeholder="Select opening time" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-fitness-text">Closing Time</Label>
          <Select>
            <SelectTrigger className="bg-fitness-inner text-fitness-text">
              <SelectValue placeholder="Select closing time" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default OperatingHours